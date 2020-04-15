import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { of } from "rxjs";
import { delay } from "rxjs/operators";

import * as _ from 'lodash';

import { RolecreateService } from "./rolecreate.service";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs";
import { Response } from "@angular/http";
import { Validators, FormControl,FormBuilder, FormGroup, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import {ToastrService} from 'ngx-toastr';
import { debug } from 'util';
import * as moment from 'moment';
import { AuthorizationService } from 'src/app/core/services/authorization.service';

export interface PeriodicElement {name: string;position: number;weight: number;read: string;symbol: string;}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, read: 'r', symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, read: 'r', symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, read: 'r', symbol: 'Li' },
];

export interface PopData {restype: string,ures: string, assignedMobileObject :[], assignedWebObject :[]}

var attributeExclutionList = []

@Component({
  selector: 'app-home',
  templateUrl: './role.component.html',
  styleUrls: ['../../core.user.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class HomeComponent implements OnInit {
  // for text limit
  textlimit100(event){
    if(this.model.description>10){
      return false;
    }
    return true;
  }
  //end of text limit

  omFlag: boolean = false
  mobileobject: any = []
  selectedWebObjects =[] ;
  selectedMobileObjects =[];
  webobject: any = []
  objectPermissionList = []
  model: any = {}
  IsCheckedr: boolean;
  IsCheckedu: boolean;
  IsCheckedc: boolean;
  IsCheckedmr: boolean;
  IsCheckedmu: boolean;
  IsCheckedmc: boolean;
  IsIndeterminate: boolean;
  LabelAlign: string;
  IsDisabled: boolean;
  IsCheckedar: boolean;
  IsCheckedau: boolean;
  IsCheckedmar: boolean;
  IsCheckedmau: boolean;
  panelOpenState = false;
  columnsToDisplay: string[] = ['subEntityName', 'create', 'update', 'read', 'symbol', 'delete'];
  expandedElement: PeriodicElement | null;

  mobileExpend;
  webExpend;
  todayDt;
  minExpireDt;
  maxExpireDt;
  minEffDt;
  maxEffDt;
  IsExpdateForvalidation;

  constructor(private toast: ToastrService,private SpinnerService: NgxSpinnerService, public router: Router, public dialog: MatDialog, public rolecreate: RolecreateService, private authService:AuthorizationService) {
    this.IsCheckedr = false;
    this.IsCheckedu = false;
    this.IsCheckedc = false;
    this.IsCheckedmr = false;
    this.IsCheckedmu = false;
    this.IsCheckedmc = false;
    this.IsIndeterminate = false;
    this.LabelAlign = 'after';
    this.IsDisabled = false;
    this.IsCheckedar = false;
    this.IsCheckedau = false;
    this.IsCheckedmar = false;
    this.IsCheckedmau = false;

    this.authService.getTimeStamp().subscribe(date=>{
      this.todayDt = new Date(date.data.responseData.split("[")[0]);
      let tomorrow = moment(this.todayDt ).add(1, 'days').toDate();
      this.IsExpdateForvalidation = new Date(this.convert('01/01/9999'));
      if(this.todayDt){
        this.minEffDt = this.todayDt;
        this.minExpireDt = tomorrow;
      }else{
        this.todayDt = new Date();
        this.minEffDt = new Date();
      }
    })
  }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.ctrlKey && (event.keyCode === 83)) {
        event.preventDefault();
        if(document.getElementById('objectSubmit')){
        let element: HTMLElement = document.getElementById('objectSubmit') as HTMLElement;
        element.click();
        }
        else{
        let element: HTMLElement = document.getElementById('submitButton') as HTMLElement;
        element.click();
        }
        }
      }


  openDialog(data: any, index: any): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {disableClose: true,

      width: "60%",
      data: { data: data, index: index ,
             assignedMobileObject : this.mobileobject,
             assignedWebObject : this.webobject
             }
    });
    dialogRef.afterClosed().subscribe(result => {
    debugger
    this.webExpend = false;
        this.mobileExpend = false;
      console.log(result.webobject);
      result.mobileobject.forEach( v => {
                      if(v.channelName ==  "Mobile"){
                        this.mobileExpend = true;
                      }
                    });
                    result.webobject.forEach( v => {
                                    if(v.channelName ==  "Web"){
                                      this.webExpend = true;
                                    }
                                  })

      this.selectedWebObjects = result.webobject ;
      this.selectedMobileObjects = result.mobileobject;
             this.omFlag = true;
       for (let i = 0; i < result.mobileobject.length; i++) {
        let mob: any;
        let element = result.mobileobject[i];
        element['isNewObject'] = true;
        element['isCreateUpdateAttributePermission']= true;
        mob =  _.find(this.mobileobject, (obj) => obj.objectId == element.objectId);
        if(!mob){
          this.mobileobject.push(element);
        }
      }
      for (let i = 0; i < result.webobject.length; i++) {
        let web: any;
        let element = result.webobject[i];
        element['isNewObject'] = true;
        web =  _.find(this.webobject, (obj) => obj.objectId == element.objectId);
        if(!web){
          this.webobject.push(element);
        }
      }
      this.webobject =  [...this.webobject];
      this.mobileobject = [...this.mobileobject];
    });
  }

  validRoleFlag: boolean = false;
  validateUser(nameobj){
    if(nameobj){
      this.model.rolename = this.model.rolename.trim();
      let name = nameobj.trim();
      if(name.length > 0){
        this.validRoleFlag = true;
        // return true;
      }else {
        this.validRoleFlag = false;
      }
    }

  }


  ngOnDestroy(){
    this.dialog.closeAll();
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  createRole() {
    this.SpinnerService.show();

    var roledata = {
      roleDto: {
        "description": this.model.description,
        "roleName": this.model.rolename,
        "status" : this.model.status
        },
    objectPermissionList: this.finalObjectAttributePermissions}
    let selectedWebObjectLength = this.selectedWebObjects.length;
    let selectedMobileObjectLength = this.selectedMobileObjects.length;
    let objectWebData = this.finalObjectAttributePermissions.filter(function (item) {
            return item.channelId == 33;
          });
    let objectMobileData = this.finalObjectAttributePermissions.filter(function (item) {
            return item.channelId == 34;
                    });
       var assignedMobileObjects = this.mobileobject.filter(function(object) {
                        return object.isNewObject == true;
                                                   });
       var assignedWebObjects = this.webobject.filter(function(object) {
                        return object.isNewObject == true;
                  });
    let distinctWebObjects = Array.from(new Set(objectWebData.map((item: any) => (item.objectId))))
    let distinctMobileObjects = Array.from(new Set(objectMobileData.map((item: any) => (item.objectId))))
       if(distinctWebObjects.length < assignedWebObjects.length ||
        distinctMobileObjects.length < assignedMobileObjects.length){
       this.SpinnerService.hide();
    this.toast.warning('Please provide permission to the selected objects','Permission Missing');
    }else{
    this.rolecreate.createRole(roledata).subscribe(
      (response: any) => {
        let ob = ErrorConstants.validateException(response);
        // debugger
        if(ob.isSuccess){
         this.SpinnerService.hide();
          this.router.navigate(['user-management/role']);
        }
        else{
         this.SpinnerService.hide();
          this.toast.warning(ob.message, ob.code);
        }
      },
      (error:any) => {
       this.SpinnerService.hide();
        this.toast.warning(ErrorConstants.getValue(404));
        console.log(error);
      }
    );
    }
   //this.finalObjectAttributePermissions=[];
  }

  OnChange($event) {
    // // debugger
    console.log($event.checked);
    //MatCheckboxChange {checked,MatCheckbox}
  }
  onGet() {
    this.SpinnerService.show();
    this.rolecreate.getroles().subscribe((users: any) => {
      this.SpinnerService.hide();
      error => console.log(error);
    });
  }

// ============================================
// Web permission code Start ----
  objectpermissionlist: any = []

  readMap(data, $event) {
    debugger
    let dataObject =[];
    if ($event.checked == true) {
    for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
                  if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 3
                  && this.finalObjectAttributePermissions[i].channelId == 33) {
                    this.finalObjectAttributePermissions.splice(i, 1);
                    break
                  }
                }
    data['isCreateUpdateAttributePermission']= false;
      data["permissionId"] = 3;
      data.readFlag = true
      if(data.attributeExclutionList != undefined){
            this.objectpermissionlist.push(Object.assign({}, data))
            dataObject.push(Object.assign({}, data));
            dataObject[0].attributeExclutionList =[];
            this.finalObjectAttributePermissions.push(Object.assign({}, dataObject[0]));
            }
            else{
            this.finalObjectAttributePermissions.push(Object.assign({}, data));
            }
    }
    else {
    data['isCreateUpdateAttributePermission']= false;
    if(data.attributeExclutionList != undefined){
                  data.attributeExclutionList.forEach(function(element,index){
                   data.attributeExclutionList[index].readFlag = true;   //set the value
                     });
                     }
      for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
        if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 3
        && this.finalObjectAttributePermissions[i].channelId == 33) {
        this.finalObjectAttributePermissions[i].attributeExclutionList=[];
          this.finalObjectAttributePermissions.splice(i, 1);
          break
        }
      }
      data.readFlag = false
      this.updateMap(data, $event)
      data['isCreateUpdateAttributePermission']= true;
    }
  }



    removeObject(value, j) {

        // debugger
          for (var i = this.webobject.length - 1; i >= 0; --i) {
            if (this.webobject[i].objectId == value.objectId && this.webobject[i].channelId == value.channelId) {
              this.webobject.splice(i, 1);
              this.selectedWebObjects.pop();
            }
          }
           for (var i = this.mobileobject.length - 1; i >= 0; --i) {
                    if (this.mobileobject[i].objectId == value.objectId && this.mobileobject[i].channelId == value.channelId) {
                      this.mobileobject.splice(i,1);
                      this.selectedMobileObjects.pop();
                    }
                  }
                  this.webobject =  [...this.webobject];
                  this.mobileobject = [...this.mobileobject];
        }
  createMap(data, $event) {
  debugger
    let dataObject =[];
    if ($event.checked == true) {
      this.IsCheckedc = true
      data["permissionId"] = 1;
      data.createFlag = true
      if(data.attributeExclutionList != undefined){
           this.objectpermissionlist.push(Object.assign({}, data))
           dataObject.push(Object.assign({}, data));
           dataObject[0].attributeExclutionList =[];
           this.finalObjectAttributePermissions.push(Object.assign({}, dataObject[0]));
            }
      else{
            this.finalObjectAttributePermissions.push(Object.assign({}, data));
           }
       this.updateMap(data, $event);
       data['isCreateUpdateAttributePermission'] = true;
    }
    else {
        for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
          if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 1
         && this.finalObjectAttributePermissions[i].channelId ===33) {
          console.log(i  +'  Deleted Object'  +this.objectpermissionlist)
            this.finalObjectAttributePermissions.splice(i, 1);
            break;
        }
        }
         data['isCreateUpdateAttributePermission'] = true;
         data.createFlag=false
    }
  }

  updateMap(data, $event) {
    debugger
    let dataObject =[];
    if ($event.checked == true) {
      data["permissionId"] = 2;
      data.updateFlag = true
      for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
              if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 2
              && this.finalObjectAttributePermissions[i].channelId == 33) {
                this.finalObjectAttributePermissions.splice(i, 1);
                break
              }
            }
     if(data.attributeExclutionList != undefined){
      this.objectpermissionlist.push(Object.assign({}, data))
                  dataObject.push(Object.assign({}, data));
                  dataObject[0].attributeExclutionList =[];
                  this.finalObjectAttributePermissions.push(Object.assign({}, dataObject[0]));
      }
     else{
      this.finalObjectAttributePermissions.push(Object.assign({}, data));
         }
      this.readMap(data, $event)
      data['isCreateUpdateAttributePermission'] = true;

    }
    else {
    if(data.attributeExclutionList != undefined){
                        data.attributeExclutionList.forEach(function(element,index){
                         data.attributeExclutionList[index].readFlag = true;   //set the value
                           });
                           }
      for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
        if ((this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName ) && (this.finalObjectAttributePermissions[i].permissionId == 2)
        && this.finalObjectAttributePermissions[i].channelId ==33) {
          console.log(i  +'  Deleted Object'  +this.objectpermissionlist);
          this.finalObjectAttributePermissions.splice(i, 1);
          break;
        }
      }
      data.updateFlag = false
      this.createMap(data, $event)
      data['isCreateUpdateAttributePermission'] = false;
    }
  }

  // Web permission code End ---

// Mobile permission code start---

MreadMap(data, $event) {
  // debugger
  let dataObject=[];
  if ($event.checked == true) {
   data['isCreateUpdateAttributePermission']= false;
    for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
                     if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 3
                     && this.finalObjectAttributePermissions[i].channelId == 34) {
                       this.finalObjectAttributePermissions.splice(i, 1);
                       break
                     }
                   }
    data["permissionId"] = 3;
    data.readFlag = true
    if(data.attributeExclutionList != undefined){
        this.objectpermissionlist.push(Object.assign({}, data))
                          dataObject.push(Object.assign({}, data));
                          dataObject[0].attributeExclutionList =[];
                          this.finalObjectAttributePermissions.push(Object.assign({}, dataObject[0]));
        }
        else{
         this.finalObjectAttributePermissions.push(Object.assign({}, data));
             }
  }
  else {
 if(data.attributeExclutionList != undefined){
                   data.attributeExclutionList.forEach(function(element,index){
                    data.attributeExclutionList[index].readFlag = true;   //set the value
                      });
                      }

    for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
      if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 3
      && this.finalObjectAttributePermissions[i].channelId ==34) {
        this.finalObjectAttributePermissions.splice(i, 1);
        break
      }
    }
    data.readFlag = false
    this.MupdateMap(data, $event)
    data['isCreateUpdateAttributePermission']= true;
  }
}

McreateMap(data, $event) {
  // debugger
  let dataObject =[];
  if ($event.checked == true) {
    this.IsCheckedc = true
    data["permissionId"] = 1;
    data.createFlag = true
    if(data.attributeExclutionList != undefined){
        this.objectpermissionlist.push(Object.assign({}, data))
                          dataObject.push(Object.assign({}, data));
                          dataObject[0].attributeExclutionList =[];
                          this.finalObjectAttributePermissions.push(Object.assign({}, dataObject[0]));
        }
        else{
        this.finalObjectAttributePermissions.push(Object.assign({}, data));
             }

    this.MupdateMap(data, $event);
     data['isCreateUpdateAttributePermission'] = true;
  }
  else {
      for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
        if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 1
        && this.finalObjectAttributePermissions[i].channelId ===34) {
          this.finalObjectAttributePermissions.splice(i, 1);
          break;
      }
      }
    data.createFlag=false
     data['isCreateUpdateAttributePermission'] = true;
  }
}

MupdateMap(data, $event) {
  // debugger
  let dataObject= [];
  if ($event.checked == true) {
  for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
                if (this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName && this.finalObjectAttributePermissions[i].permissionId == 2
                && this.finalObjectAttributePermissions[i].channelId == 34) {
                  this.finalObjectAttributePermissions.splice(i, 1);
                  break
                }
              }
    data["permissionId"] = 2;
    data.updateFlag = true
    if(data.attributeExclutionList != undefined){
        this.objectpermissionlist.push(Object.assign({}, data))
                          dataObject.push(Object.assign({}, data));
                          dataObject[0].attributeExclutionList =[];
                          this.finalObjectAttributePermissions.push(Object.assign({}, dataObject[0]));
        }
        else{
        this.finalObjectAttributePermissions.push(Object.assign({}, data));
             }
    this.MreadMap(data, $event)
     data['isCreateUpdateAttributePermission']= true;
  }
  else {
  if(data.attributeExclutionList != undefined){
    data.attributeExclutionList.forEach(function(element,index){
     data.attributeExclutionList[index].readFlag = true;   //set the value
       });
                             }
    for (var i = this.finalObjectAttributePermissions.length - 1; i >= 0; --i) {
      if ((this.finalObjectAttributePermissions[i].subEntityName == data.subEntityName ) && (this.finalObjectAttributePermissions[i].permissionId == 2
      && this.finalObjectAttributePermissions[i].channelId ==34)) {
        this.finalObjectAttributePermissions.splice(i, 1);
        break;
      }
    }
    data.updateFlag = false
    this.McreateMap(data, $event);
    data['isCreateUpdateAttributePermission']= false;
  }
}


// Mobile permission code End ---

// =============================================
//finalObjectAttributePermissions =[];
attributeExclusionArray=[];
objectPermissions =[];

finalObjectAttributePermissions = [];

readAttributeExclution(data, channelId, $event){
// debugger
let objectAttributePermissions = {
    objectPermissions: []
};

let objectPermissions: any= {objectPermissionList:{attributeExclutionList:[],permissionId:'',channelId:'',objectId:''}};
let existingAttributeExclusion=[];
for (let ae of this.objectpermissionlist) {
if(ae.objectId == data.objectId && ae.permissionId ==3 && ae.channelId == channelId){
for (let attribute of ae.attributeExclutionList) {
var index = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === ae.objectId && object.channelId === ae.channelId && object.permissionId===3));
if ($event.checked == false && attribute.attributeName==data.attributeName && !attribute.readFlag) {
if(this.finalObjectAttributePermissions.length==0 || !this.checkInPermissionArray(this.finalObjectAttributePermissions, attribute, ae)){
var index = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === ae.objectId && object.channelId === ae.channelId && object.permissionId===3));
attribute.objectAttributeId = attribute.id;
attribute.status =1;
let clonedAttributeList =[];
if(this.finalObjectAttributePermissions[index].attributeExclutionList != undefined){
 clonedAttributeList = this.finalObjectAttributePermissions[index].attributeExclutionList;
}
clonedAttributeList.push(attribute);
this.finalObjectAttributePermissions[index].attributeExclutionList = Object.assign([],clonedAttributeList);
break;
}
}
else if ($event.checked == true && attribute.attributeName==data.attributeName) {
let unCheckedClonedAttributeList =[];
if(this.finalObjectAttributePermissions[index].attributeExclutionList != undefined){
    unCheckedClonedAttributeList = this.finalObjectAttributePermissions[index].attributeExclutionList;
    var attributeIndex = unCheckedClonedAttributeList.findIndex(object=>(object.objectId === data.objectId && object.objectAttributeId === data.objectAttributeId ));
   if(attributeIndex>=0){
   this.finalObjectAttributePermissions[index].attributeExclutionList.splice(attributeIndex,1);
   }
   }
}
}
break;
}
}
}

checkInPermissionArray(objArray, val, objectPermission) {
  // debugger
  for (var i = 0; i < objArray.length; i++) {
       if (objArray[i].attributeExclutionList.id == val.id && objArray[i].permissionId ==objectPermission.permissionId
            && objArray[i].channelId ==objectPermission.channelId) {
          return true;
      }
  }
  return false;
};
existingAttributeExclusion=[];
attributeExistingIndex=0;
checkIfObjectExclusionExist(objArray, attribute, object) {
    // debugger
    this.existingAttributeExclusion=[];
    this.attributeExistingIndex=0;
    for (var i = 0; i < objArray.length; i++) {
    this.attributeExistingIndex++;
    for (let objectAttribute of objArray[i].attributeExclutionList){
        if (objArray[i].objectId == object.objectId && objArray[i].permissionId ==object.permissionId
        && objArray[i].channelId ==object.channelId && objArray.attributeExclutionList.length>0) {
        this.existingAttributeExclusion.push(objectAttribute.attributeExclutionList);
            return true;
        }
        }
    }
    return false;
};



  updateAttributeExclution(data, $event) {
    // // debugger
    for (let ae of this.objectpermissionlist) {
      for (let attri of ae.attributeExclutionList) {
        if ($event.checked == true) {
          if (attri.attributeName == data) {
            attri.permissionId = 2;
            this.IsCheckedau = true
          }
          console.log(attri.attributeExclutionList)
        }
        else {
          if (attri.attributeName == data) {
            attri.permissionId = 0;
          }
          this.IsCheckedau = false
        }
      }
    }
  }

  mreadAttributeExclution(data, $event) {
    // // debugger
    for (let ae of this.objectpermissionlist) {
      for (let attri of ae.attributeExclutionList) {
        if ($event.checked == true) {

          if (attri.attributeName == data) {
            attri.permissionId = 2;
            this.IsCheckedmar = true
          }
          console.log(attri.attributeExclutionList)
        }
        else {
          if (attri.attributeName == data) {
            attri.permissionId = 0;

          }
          this.IsCheckedmar = false
          this.IsCheckedmau = false
        }
      }
    }
  }

  mupdateAttributeExclution(data, $event) {
    // debugger
    for (let ae of this.objectpermissionlist) {
      for (let attri of ae.attributeExclutionList) {

        if ($event.checked == true) {
          if (attri.attributeName == data) {
            attri.permissionId = 3;
            // this.IsCheckedmau = true
            this.mreadAttributeExclution(data, $event)

          }
          console.log(attri.attributeExclutionList)
        }
        else {
          if (attri.attributeName == data) {
            attri.permissionId = 0;

          }
          // this.IsCheckedmau = false
        }
      }
    }
  }

  selectObject() {}

  ngOnInit() {

    this.model.status=1;
    this.model.statusValue='Active';
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['../../core.user.css']
})
export class DialogContentExampleDialog implements OnInit {
  modeld: any = {}

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>, public roleservice: RolecreateService,private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: PopData, ) { }

  model1: any = []
  mFlag: boolean = false
  wFlag: boolean = false

  dataSource
  objectList: any
  objectList2: any
  channelList=[]


  allFilteredObjects =[];

  ngOnInit() {
    this.SpinnerService.show();
    this.roleservice.objectList()
      .subscribe((users: any) => {
        this.objectList = users.data.responseData;
        this.SpinnerService.hide();
        let ticked=false;
        let all = { id: undefined, lookupVal: "All", lookupTypeId: 12, status: 1 }
        for (let data of users.data.referenceData.channelList) {
          this.channelList.push(data)
          console.log(this.channelList, "channellist")
        }
        this.channelList.push(all)
        for (let data of users.data.responseData) {
        let assignedWebPermissions =  _.find(this.data.assignedWebObject, (obj) => (obj.objectId == data.objectId && obj.channelId == data.channelId));
        let assignedMobilePermissions =  _.find(this.data.assignedMobileObject, (obj) => (obj.objectId == data.objectId && obj.channelId == data.channelId));
          let assignedObjects = data;
          if(!assignedWebPermissions && !assignedMobilePermissions){

          if (data.channelId == 33) {
            data.channelName = "Web"
          }
          else {
            data.channelName = "Mobile"
          }
          this.allFilteredObjects.push(Object.assign({},assignedObjects));
          }
        }

        this.dataSource =  [...this.allFilteredObjects] //new MatTableDataSource(this.allFilteredObjects);
          error => console.log(error);
      });

}


  panelOpenState = false;

  displayedColumns: string[] = ['entityName', 'subEntityName', 'moduleName', 'select', 'channel'];
  // data1 = ELEMENT_DATA;
  userFilter: any = { branchCode: '' };

  applyFilter(filterValue: string, ) {
    if(this.model1.channelType){
      if(!filterValue){
        return this.dataSource = this.allFilteredObjects.filter(obj => {
          if(this.model1.channelType == obj.channelId){
            return obj;
            }
        });
      }else{
        return this.dataSource = this.allFilteredObjects.filter(obj => {
          if(this.model1.channelType == obj.channelId){
            return obj.subEntityName.toLowerCase().includes(filterValue.toLowerCase());
            }
          });
      }
    }else{
      if(!filterValue){
        return this.dataSource = this.allFilteredObjects.filter(obj => {
            return obj;
        });
      }else{
        return this.dataSource = this.allFilteredObjects.filter(obj => {
            return obj.subEntityName.toLowerCase().includes(filterValue.toLowerCase());
          });
      }
    }

  }



  closeDialog(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  objectData() {
    // // debugger
    var a = this.model1.mobile
    // this. objectdata =  this.objectList.data.filter(function(object) {
    //  return object.subEntityName == data;
    //});
  }
  mobiledata = []
  md = 0

  mobileData(item) {
    // // debugger
    var objectdata = this.objectList.data.filter(function (object) {
      return object.subEntityName == item;
    })
    this.mFlag = true
    this.wFlag = false
    if (this.model1.mobile == false || this.md === 0) {
      // // debugger
      this.md++
      var data = objectdata.filter(function (object) {
        return object.channelId == 34;
      });
      this.mobiledata = data
    }
  }


  webdata = []
  wd = 0;
  channelData(data,val) {
    this.applyFilter(val);
  }


  mobileentity = []
  allEntity: any = [];
  selectEntity(data, $event, alldata) {
    if($event.checked == true){
      let index, index2;
      index = this.dataSource.indexOf(data);
      this.dataSource[index]['checked'] = 'checked';
      index2 = this.allFilteredObjects.indexOf(data);
      this.allFilteredObjects[index2]['checked'] = 'checked';
    }else {
      let index, index2;
      index = this.dataSource.indexOf(data);
      delete this.dataSource[index]['checked'];
      index2 = this.allFilteredObjects.indexOf(data);
      delete this.allFilteredObjects[index2]['checked'];
    }
  if(data.channelId==34){
    if ($event.checked == true) {
      this.mobileentity.push(data)
      for (var i = this.objectList.length - 1; i >= 0; --i) {
        if (this.objectList[i].subEntityName == data.subEntityName) {
          this.objectList.splice(i, 1);
        }
      }
    }
    else {
      for (var i = this.mobileentity.length - 1; i >= 0; --i) {
        if (this.mobileentity[i].subEntityName == data.subEntityName) {
          this.mobileentity.splice(i, 1);
        }
      }
      this.objectList.data.push(data)
    }
  }
  else{
    if ($event.checked == true) {
      this.webentity.push(data)
      for (var i = this.objectList.length - 1; i >= 0; --i) {
        if (this.objectList[i].subEntityName == data.subEntityName) {
          this.objectList.splice(i, 1);
        }
      }
    }
    else {
      for (var i = this.webentity.length - 1; i >= 0; --i) {
        if (this.webentity[i].subEntityName == data.subEntityName) {
          this.webentity.splice(i, 1);
        }
      }
      this.objectList.data.push(data)
    }

  }

  }

  webentity = []

  webEntity(data, $event) {
    // // debugger
    this.model1.wentity
    if ($event.checked == true) {

      this.webentity.push(data)

      for (var i = this.objectList.data.length - 1; i >= 0; --i) {
        if (this.objectList.data[i].subEntityName == data.subEntityName) {
          this.objectList.data.splice(i, 1);
        }
      }
    }
    else {
      for (var i = this.webentity.length - 1; i >= 0; --i) {
        if (this.webentity[i].subEntityName == data.subEntityName) {
          this.webentity.splice(i, 1);
        }
      }
      this.objectList.data.push(data)
    }

    console.log(this.mobileentity)
  }


  filterEntity() {
    // debugger
    let mobileobject = []
    let webobject = []
    for (let w of this.webentity) {
      w.createFlag = false
      w.updateFlag = false
      w.readFlag = false
      if(w.attributeExclutionList != undefined){
      for (let a of w.attributeExclutionList) {
        a.updateFlag = true
        a.readFlag = true
      }
      }
    }
    for (let m of this.mobileentity) {
          m.createFlag = false
          m.updateFlag = false
          m.readFlag = false
          if(m.attributeExclutionList != undefined){
          for (let a of m.attributeExclutionList) {
            a.updateFlag = true
            a.readFlag = true
          }
        }
        }
    mobileobject = this.mobileentity
    webobject = this.webentity
    this.dialogRef.close({ webobject, mobileobject });
    console.log(mobileobject, "mobile")
  }

  //json

  objectList1: any = {
    data: [
      {
        "moduleId": 4,
        "objectId": 1,
        "moduleName": "Credit Contract",
        "entityName": "Test",
        "subEntityName": "SE1",
        "channel": "WEB",
        "isPublic": 0,
        "permissionId": 0,
        "attributeExclutionList": [
          {
            "attributeName": "obj1attribute1",
            "createdBy": "1",
            "updatedBY": "1",
            "description": "test description",
            "permissionId": 0,
            "objectId": 1,
            "objectattribute_id": 0,
            "obj_role_perm_map_id": 0,
            "effectiveDate": "2019-09-09T12:59:35.568+0000",
            "id": 1
          },

        ],
        "status": 0
      },


      {
        "moduleId": 4,
        "objectId": 2,
        "moduleName": "Credit Contract",
        "entityName": "Test",
        "subEntityName": "SE2",
        "channel": "MOBILE",
        "isPublic": 0,
        "permissionId": 0,
        "attributeExclutionList": [
          {
            "attributeName": "obj1attribute1",
            "createdBy": "1",
            "updatedBY": "1",
            "description": "test description",
            "permissionId": 0,
            "objectId": 1,
            "objectattribute_id": 0,
            "obj_role_perm_map_id": 0,
            "effectiveDate": "2019-09-09T12:59:35.568+0000",
            "id": 1
          },

        ],
        "status": 0
      }
    ]
  }
}



