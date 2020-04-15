import { Component, OnInit, Inject, ɵConsole , HostListener} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { RolecreateService } from "./../role/rolecreate.service";
import { ChangeDetectionStrategy } from '@angular/core';
import { animate,state,style,transition,trigger } from "@angular/animations";
import { $ } from "protractor";
import { MatTableDataSource } from "@angular/material/table";
import { AuthorizationService } from "../../core/services/authorization.service";
import { NgxPermissionsService } from "ngx-permissions";
import { filter } from "rxjs-compat/operator/filter";
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from 'lodash';
import * as moment from 'moment';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  read: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
export interface PopData {
  restype: string;
  ures: string;
  assignedObject :[];
  assignedMobileObject :[];
  assignedWebObject :[];
}

@Component({
  selector: "app-rolldetail",
  templateUrl: "./rolldetail.component.html",
  styleUrls: ["../../core.user.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class RolldetailComponent implements OnInit {

//textarea limit
textlimit100(event): boolean{
  if(this.model.description>100){
    return false;
  }
  return true;
}
//end of textarea limit

  panelOpenState = false;
  columnsToDisplay: string[] = [
    "subEntityName",
    "create",
    "update",
    "read",
    "symbol",
    "delete"
  ];
  expandedElement: PeriodicElement | null;

  //data = ELEMENT_DATA;
  dataSource;
  mobileDataSource;
  model: any = {};
  IsCheckedmar: boolean;
  IsCheckedmr: boolean;
  IsCheckedmau: boolean;
  IsCheckedmu: boolean;
  IsCheckedmc: boolean;
  IsCheckedar: boolean;
  IsCheckedr: boolean;
  IsCheckedau: boolean;
  IsCheckedu: boolean;
  IsCheckedc: boolean;
  IsChecked: boolean;
  IsIndeterminate: boolean;
  LabelAlign: string;
  IsDisabled: boolean;
  mobileobject: any ;
  webobject: any ;

objectPermissionList=[];
originalObjectPermissionList :any;
  //permission
  userPermission:any = [];
  rolePermission:any = [];
  objectPermission:any = [];
   //end permission
  mobileExpend;
  webExpend;

  todayDt;

  constructor(
    private route: ActivatedRoute,private SpinnerService: NgxSpinnerService,
    private router: Router,
    private roleservice: RolecreateService,
    public dialog: MatDialog,
    private AuthorizationService:AuthorizationService,
    private permissionsService:NgxPermissionsService,
    private toast: ToastrService,
  ) {
    this.IsIndeterminate = false;
    this.LabelAlign = "after";
    this.IsDisabled = false;
    this.IsChecked = false;
    this.IsCheckedc = false;
    this.IsCheckedr = false;
    this.IsCheckedu = false;
    this.IsCheckedau = false;
    this.IsCheckedar = false;
    this.IsCheckedmc = false;
    this.IsCheckedmr = false;
    this.IsCheckedmu = false;
    this.IsCheckedmau = false;
    this.IsCheckedmar = false;

    this.AuthorizationService.getTimeStamp().subscribe(date=>{
      this.todayDt = new Date(date.data.responseData.split("[")[0])
    })
  }
  roleid: any;
  roleiddata: any;
   openDialog(data: any, index: any): void {
     const dialogRef = this.dialog.open(DialogContentExampleDialogEdit, {disableClose: true,
       width: "60%",
       data: { data: data, index: index , assignedObject: this.objectPermissionList,
       assignedMobileObject : this.mobileData,
       assignedWebObject : this.webData
       }
     });

    dialogRef.afterClosed().subscribe(result => {
    debugger
    //handle expend table as per selected permission
    this.webExpend = false;
    this.mobileExpend = false;
    result.mobileobject.forEach( v => {
      if(v.channelName ==  "Web"){
        this.webExpend = true;
      }else if(v.channelName ==  "Mobile"){
        this.mobileExpend = true;
      }
    })
   //end handle expend table as per selected permission



    console.log(result);
        for (let i = 0; i < result.mobileobject.length; i++) {
          const element = result.mobileobject[i];
          this.selectedObjects = result.mobileobject;
          element['isNewObject'] = true;
          element['isCreateUpdateAttributePermission']= true;
          if(element.channelId==33){
          debugger
              // web
            this.webList.push(element)
          }
          else{
            // Mobile
            this.MobileList.push(element);
          }
        }
        for (let i = 0; i < this.webList.length; i++) {
          const element = this.webList[i];
          if(element.channelId==33){
            if(this.webData.length ==0 || checkInRoleArry(this.webData, element.subEntityName )==false){
            console.log(element);
            this.webData.push(element);
            }

          }
        }

        for (let i = 0; i < this.MobileList.length; i++) {
          const element = this.MobileList[i];
          if(element.channelId==34){
            if(this.mobileData.length ==0 || checkInRoleArry(this.mobileData, element.subEntityName )==false){
            console.log(element);

            this.mobileData.push(element);
            }

          }
        }
        this.dataSource = new MatTableDataSource(this.webData);
        this.mobileDataSource = new MatTableDataSource(this.mobileData);

      console.log(this.webData  +  ' /* web */ Data For Binding' );
      console.log(this.mobileData   + ' Mobile Data For Binding' );

    }
    );

    let checkInRoleArry = (objArray, val) => {
      // // debugger
      for (var i = 0; i < objArray.length; i++) {

          if (objArray[i].subEntityName.toUpperCase() == val.toUpperCase()) {

              return true;

          }

      }

      return false;

    };


    function uniqueObj(data){
      let p = Object.create(null)
      let  Unq = data.reduce(function (r, o) {
            if (!(o.subEntityName in p)) {
                o.permission=[]; p[o.subEntityName] = r.push(o) - 1;
                var index = data.findIndex(object=>(object.objectId === o.objectId &&
                object.channelId === o.channelId && object.permissionId===3 ));
                 if(o.permissionId == 1 || o.permissionId == 2){
                   o['isCreateUpdateAttributePermission'] = true;
                                        }
                o.attributeExclutionList = data[index].attributeExclutionList;
                o.permission.push({permissionId:o.permissionId,permissionType:o.permissionType,id:o.id})
                return r;
            }
            else{
                r.forEach(i => {
                    if(i.subEntityName==o.subEntityName  && i.permission.length<3){
                        if(o.permissionId == 1 || o.permissionId == 2){
                        i['isCreateUpdateAttributePermission'] = true;
                        }
                        i.permission.push({permissionId:o.permissionId,permissionType:o.permissionType,id:o.id});
                    }
                });
            }
            return r;
        }, []);
        return Unq;
    }
  }

  //permission data
  permissionData: any = [
    {
      permissionType: [],
      subEntityName: String
    }
  ];

  status: any = [
    { value: "ACTIVE", id: 1 },
    { value: "INACTIVE", id: 0 }
  ];

  StatusPrivacy;
  webobject1;
  webList=[];
  MobileList=[];
  selectedObjects =[];
  webData=[]; mobileData=[];
  oldRoleName ='';
  roleDescription='';
  roleStatus='';
 // objectPermissionList=[];
  apiHitCondition
  ngOnInit() {
    //permission
    const perm = [];
    this.permissionsService.loadPermissions(this.AuthorizationService.getPermissions('role'));
    //end permission

      let webList=[];
      let MobileList=[];
      this.webData=[];
      this.mobileData=[];
      this.SpinnerService.show();
      this.route.params.subscribe(params => {
        this.SpinnerService.hide();
      if (params["roleId"]) {
        this.roleid = params["roleId"];
        console.log("this is edit,process is there..");
        this.roleservice.objectIdList(this.roleid).subscribe((users: any) => {
          let ob = ErrorConstants.validateException(users);
      if(ob.isSuccess){
        debugger;
        this.model.roleName = users.data.responseData[0].roleDto.roleName;
        this.model.status =  users.data.responseData[0].roleDto.status;
        this.StatusPrivacy=users.data.responseData[0].roleDto.status;
        this.model.description =  users.data.responseData[0].roleDto.description;
        this.oldRoleName= users.data.responseData[0].roleDto.roleName;
        this.roleStatus = users.data.responseData[0].roleDto.status;
        this.roleDescription = users.data.responseData[0].roleDto.description;
        this.originalObjectPermissionList  = Object.assign({}, users);
        this.objectPermissionList = users.data.responseData[0].objectPermissionList;
        let Objects= users.data.responseData[0].objectPermissionList;
        if(users.data.responseData[0].objectPermissionList){
            var MobileTypeObject = uniqueObj(Objects.filter(function(Obj) {
              return Obj.channelId == 34;
            }))
            var WebTypeObject = uniqueObj(Objects.filter(function(Obj) {
              return Obj.channelId == 33;
            }))
            this.webData=this.dataSource= this.webData=WebTypeObject;
            this.mobileData=this.mobileDataSource=MobileTypeObject
            console.log(this.webData);
            console.log(this.mobileData);
        }
      }
      else{
        this.toast.warning(ob.message, ob.code);
      }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });

   }
 });

          function uniqueObj(data){
            let p = Object.create(null)
            let  Unq = data.reduce(function (r, o) {
              // debugger
              o.permission={
                ['CREATE']: {permissionId: Number, permissionType: "CREATE", id: Number, checked: false},
                ['READ']: {permissionId: Number, permissionType: "READ", id: Number, checked: false},
                ['UPDATE']: {permissionId: Number, permissionType: "UPDATE", id: Number, checked: false}
              };
                  if (!(o.subEntityName in p)) {
                      p[o.subEntityName] = r.push(o) - 1;
          var index = data.findIndex(object=>(object.objectId === o.objectId &&
            object.channelId === o.channelId && object.permissionId===3 ));
           if(o.permissionId == 1 || o.permissionId == 2){
                o['isCreateUpdateAttributePermission'] = true;
                              }
            o.attributeExclutionList = data[index].attributeExclutionList;
                      o.permission[o.permissionType] = Object.assign({},
                      {permissionId:o.permissionId,permissionType:o.permissionType,id:o.id,checked: true});
                    return r;
                  }
                  else{
                      r.forEach(i => {

                        if(i.subEntityName==o.subEntityName ){
                        if(o.permissionId == 1 || o.permissionId == 2){
                          i['isCreateUpdateAttributePermission'] = true;
                                                }
                          i.permission[o.permissionType] ={permissionId:o.permissionId,permissionType:o.permissionType,id:o.id,checked: true};
                        }
                      });
                  }
                  return r;
              }, []);
              return Unq;
          }
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

validateUser(nameobj){
  if(nameobj){
    this.model.roleName = this.model.roleName.trim();
  }

}

 filterObjectList(data){
  //  // debugger
   let filterData
   let map:any = new Map();
    var flag = 0;
      // const testId = [];
      data.forEach(element => {
        element["permissionList"]=[];
        if (map.has(element.subEntityName)) {
         let permissions = [];
         let object = map.get(element.subEntityName);
          map.get(element.subEntityName).permissionList.push({
              id: element.id,
              permissionId: element.permissionId
          });
        } else {
           flag= 0;
          element.permissionList.push({
            id: element.id,
            permissionId: element.permissionId
          });
          map.set(element.subEntityName, element);
        }
      });
      let aa
   map.forEach((value: any, key: string) => {
    console.log(key, value);
    filterData= map.get(key);

});
console.log("filter data is : " + filterData[0])
return filterData;
}

  editRole() {
  this.SpinnerService.show();
        let addOrRemoveOrUpdate='';
        addOrRemoveOrUpdate='UPDATE';
    var roledata = {
      roleDto: {
        description: this.model.description,
        roleName: this.model.roleName,
        roleId: this.roleid,
        updatedBy: "TEST_UPDATE_USER",
        status: this.model.status,
        addOrRemoveOrUpdate : addOrRemoveOrUpdate
      },
      objectPermissionList: this.finalObjectAttributePermissions
    };
 var mobileDataObject = this.finalObjectAttributePermissions.filter(function(object) {
        return object.channelId == 34;
      });
       var webDataObject = this.finalObjectAttributePermissions.filter(function(object) {
              return object.channelId == 33;
            });

      var assignedMobileObjects = this.MobileList.filter(function(object) {
                   return object.isNewObject == true;
                                              });
      var assignedWebObjects = this.webList.filter(function(object) {
                   return object.isNewObject == true;
             });
    let selectedObjectLength = this.selectedObjects.length;
    let distinctMobileObjects = Array.from(new Set(mobileDataObject.map((item: any) => item.objectId)))
    let distinctWebObjects = Array.from(new Set(webDataObject.map((item: any) => item.objectId)))
  if(distinctMobileObjects.length < assignedMobileObjects.length ||
  distinctWebObjects.length < assignedWebObjects.length){
  this.SpinnerService.hide();
this.toast.warning('Please provide permission to the selected objects','Permission Missing');
}
else{
    this.roleservice.editRole(roledata).subscribe(
      (response: any) => {
        let ob = ErrorConstants.validateException(response);
        if(ob.isSuccess){
          console.log(response.message);
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
      }
    );
    }
}


finalObjectAttributePermissions = [];
readAttributeExclusionForObject(data,channelId, $event){
    debugger
    let objectAttributePermissions = {
        objectPermissions: []
    };
    let objectPermissions: any= {objectPermissionList:{attributeExclutionList:[],permissionId:'',channelId:'',objectId:''}};
    var finalObjectAttributePermissionsIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId &&
        object.channelId === channelId && object.permissionId===3 && object.isNewObject));
    var existingObjectAttributePermissionsIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId &&
                object.channelId === channelId && object.permissionId===3));
    var existingObjectAttributePermIndex = this.objectPermissionList.findIndex(object=>(object.objectId === data.objectId &&
                                object.channelId === channelId && object.permissionId===3));
        if(finalObjectAttributePermissionsIndex >=0){
        let clonedAttributeList = this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].attributeExclutionList;
                                let index = clonedAttributeList.findIndex(object=>(object.objectId === data.objectId &&
                                object.objectAttributeId === data.objectAttributeId))
                                if(index >=0){
                              this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].attributeExclutionList.splice(index,1)
                                 }
        if($event.checked == false){
        objectPermissions.objectPermissionList.attributeExclutionList=[];
        objectPermissions.objectPermissionList.permissionId=this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].permissionId;
        objectPermissions.objectPermissionList.channelId=this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].channelId;
        objectPermissions.objectPermissionList.objectId=this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].objectId;
        data['isAddorUpdate'] ='ADD';
        objectPermissions.objectPermissionList.attributeExclutionList.push(Object.assign({},data));
        for(let object of this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].attributeExclutionList){
              //  if(object.excluded){
                objectPermissions.objectPermissionList.attributeExclutionList.push(Object.assign({},object));
              //  }
                }
        this.finalObjectAttributePermissions[finalObjectAttributePermissionsIndex].attributeExclutionList =objectPermissions.objectPermissionList.attributeExclutionList;
        }
        }

        else if(existingObjectAttributePermissionsIndex >=0){
        let clonedObjectData  = Object.assign({}, data);
                        objectPermissions.objectPermissionList.attributeExclutionList=[];
                        objectPermissions.objectPermissionList.permissionId=this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].permissionId;
                        objectPermissions.objectPermissionList.channelId=this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].channelId;
                        objectPermissions.objectPermissionList.objectId=this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].objectId;
                        if(this.objectPermissionList[existingObjectAttributePermIndex] !=undefined &&
                        this.objectPermissionList[existingObjectAttributePermIndex].id != undefined){
                        clonedObjectData.objRolePermMapId = this.objectPermissionList[existingObjectAttributePermIndex].id;
                        }
                        else if(this.objectPermissionList[existingObjectAttributePermIndex] !=undefined &&
                        this.objectPermissionList[existingObjectAttributePermIndex].attributeExclutionList[0] != undefined &&
                        this.objectPermissionList[existingObjectAttributePermIndex].attributeExclutionList[0].objRolePermMapId != undefined){
                        clonedObjectData.objRolePermMapId =this.objectPermissionList[existingObjectAttributePermIndex].attributeExclutionList[0].objRolePermMapId;
                        }
                        let clonedAttributeList = this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].attributeExclutionList;
                        let index = clonedAttributeList.findIndex(object=>(object.objectId === data.objectId &&
                        object.objRolePermMapId === data.objRolePermMapId && object.objectAttributeId === data.objectAttributeId))
                        if(index >=0){
                      this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].attributeExclutionList.splice(index,1)
                         }
                        if($event.checked == true ){
                            clonedObjectData.status =0;
                            clonedObjectData.excluded=false;
                        //    data.excluded=false;
                            clonedObjectData['isAddorUpdate'] ='UPDATE';}
                            else if($event.checked == false ){
                            clonedObjectData.excluded=true;
                           // data.excluded=true;
                            clonedObjectData.status =1;
                            clonedObjectData['isAddorUpdate'] ='ADD';}
                        objectPermissions.objectPermissionList.attributeExclutionList.push(Object.assign({},clonedObjectData));
                        for(let object of this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].attributeExclutionList){
                                if(object.excluded){
                                objectPermissions.objectPermissionList.attributeExclutionList.push(Object.assign({},object));
                                }
                                }
                        this.finalObjectAttributePermissions[existingObjectAttributePermissionsIndex].attributeExclutionList.push(clonedObjectData);
                        }
        else{
        var existingObjectAttributePermissionIndex = this.objectPermissionList.findIndex(object=>(object.objectId === data.objectId &&
                        object.channelId === channelId && object.permissionId===3));
    let existingAobjectPermissionListttributeExclusion=[];
    let clonedObject  = Object.assign([], this.objectPermissionList[existingObjectAttributePermissionIndex]);
    //clonedObject = this.objectPermissionList[existingObjectAttributePermissionIndex].map(x => Object.assign({}, x));
    data.objRolePermMapId = clonedObject.id;
    clonedObject.attributeExclutionList =[];
    clonedObject["isAddOrRemoveOrUpdate"]='';
     if($event.checked == true ){
    data.status =0;
    data['isAddorUpdate'] ='UPDATE';}
    else if($event.checked == false ){
    data.status =1;
    data['isAddorUpdate'] ='ADD';}
    clonedObject.attributeExclutionList.push(data);
    this.finalObjectAttributePermissions.push(Object.assign({}, clonedObject));

    }
    }

    removeObject(value, j) {

      // debugger
        for (var i = this.webData.length - 1; i >= 0; --i) {
          if (this.webData[i].objectId == value.objectId && this.webData[i].channelId == value.channelId) {
            this.selectedObjects.pop();
          //const index: number = this.webList.indexOf(this.webData[i].objectId);
          var index = this.webList.findIndex(object=>object.objectId === this.webData[i].objectId)
          if(index>=0){
          this.webList.splice(index, 1);
            }
            this.webData.splice(i, 1);
          }
        }
         for (var i = this.mobileData.length - 1; i >= 0; --i) {
                  if (this.mobileData[i].objectId == value.objectId && this.mobileData[i].channelId == value.channelId) {
                    this.selectedObjects.pop();
                    var index = this.MobileList.findIndex(object=>object.objectId === this.mobileData[i].objectId)
                            if(index>=0){

                              this.MobileList.splice(index, 1);
                                }
                    this.mobileData.splice(i,1);
                  }
                }
                this.dataSource = new MatTableDataSource(this.webData);
                this.mobileDataSource = new MatTableDataSource(this.mobileData);
      }


isCreateUpdateAttributePermission : boolean =false;
createMap(data, $event) {
     debugger
    if ($event.checked == true) {
    data['isCreateUpdateAttributePermission']= true;
    let createMapData =[];
      data.createFlag = true
      data.updateFlag = true
      data.readFlag = true
      let permissionIds =[1,2,3];
      data["filteredId"] = '';
      data["isAddOrRemoveOrUpdate"] = 'UPDATE';
       let readObjectIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId
            && object.channelId === data.channelId && object.permissionId === 3 &&
            object.isAddOrRemoveOrUpdate === 'REMOVE'));
            if(readObjectIndex >=0){
            this.finalObjectAttributePermissions.splice(readObjectIndex,1);
            }
       let removeAttrIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId
                   && object.channelId === data.channelId && object.permissionId === 3));
                   if(removeAttrIndex >=0 && this.finalObjectAttributePermissions[removeAttrIndex].attributeExclutionList != undefined){
                   this.finalObjectAttributePermissions[removeAttrIndex].attributeExclutionList=[];
                   }
      data.status=1;
      for(let permissionId of permissionIds){
                    const index: number = this.finalObjectAttributePermissions.indexOf(data.objectId +""+ data.channelId +""+ data.permissionId);
                    if(index>=0){
                    this.finalObjectAttributePermissions.splice(index, 1);
                    }
                    createMapData.push(Object.assign({}, data));
                  /**  if(createMapData[0].id != undefined && createMapData[0].id >0){
                    createMapData[0].id = 0;
                    }**/
                    createMapData[0]["filteredId"] = data.objectId +""+ data.channelId +""+ data.permissionId;
                    createMapData[0].permissionId = permissionId;
                    createMapData[0].attributeExclutionList=[];
                    this.finalObjectAttributePermissions.push(Object.assign({}, createMapData[0]));

                    }
    }
    else {
let createMapData =[];
      data.createFlag = false
      data['isCreateUpdateAttributePermission']= true;
      let permissionIds =[1];

        data["filteredId"] = '';
       if(data.isAddOrRemoveOrUpdate == undefined || data.isAddOrRemoveOrUpdate != 'ADD'){
            data["isAddOrRemoveOrUpdate"] = 'REMOVE'}
      for(let permissionId of permissionIds){
       //var index = this.finalObjectAttributePermissions.findIndex(object=>(object.filteredId=== (data.objectId +""+ data.channelId +""+ data.permissionId)));
      const index: number = this.finalObjectAttributePermissions.indexOf(data.objectId +""+ data.channelId +""+ data.permissionId);
                          if(index>=0){
                          this.finalObjectAttributePermissions.splice(index, 1);
                          }
             createMapData.push(Object.assign({}, data));
             createMapData[0]["filteredId"] = data.objectId +""+ data.channelId +""+ data.permissionId;
             createMapData[0].permissionId = permissionId;
             createMapData[0].attributeExclutionList=[];
             this.finalObjectAttributePermissions.push(Object.assign({}, createMapData[0]));
      }
    }
  }


 updateMap(data, $event) {
 debugger
      if ($event.checked == true) {
      data['isCreateUpdateAttributePermission']= true;
       let createMapData =[];
        this.IsCheckedc = true
        var objIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId &&
                                                   object.channelId === data.channelId && object.permissionId===1 ));
       if(!data.isNewObject && objIndex>=0){
          data["isAddOrRemoveOrUpdate"] = 'REMOVE';
          data.permissionId=1;
          this.finalObjectAttributePermissions.push(Object.assign({}, data));
               }
     let readObjectIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId
                  && object.channelId === data.channelId && object.permissionId === 3 &&
                  object.isAddOrRemoveOrUpdate === 'REMOVE'));
                  if(readObjectIndex >=0){
                  this.finalObjectAttributePermissions.splice(readObjectIndex,1);
                  }
     let removeAttrIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId
                        && object.channelId === data.channelId && object.permissionId === 3));
                        if(removeAttrIndex >=0){
                        if(this.finalObjectAttributePermissions[removeAttrIndex].attributeExclutionList != undefined){
                        this.finalObjectAttributePermissions[removeAttrIndex].attributeExclutionList=[];}
                        }
        let permissionIds =[2,3];
          if(data.isAddOrRemoveOrUpdate == undefined || data.isAddOrRemoveOrUpdate != 'ADD'){

               }

        data["isAddOrRemoveOrUpdate"] = 'UPDATE';
        data.status=1;
        data["filteredId"] = '';
        data.createFlag = false
        data.updateFlag = true
        data.readFlag=true
        for(let permissionId of permissionIds){
              createMapData.push(Object.assign({}, data));
             // var index = this.finalObjectAttributePermissions.findIndex(object=>(object.filteredId=== (data.objectId +""+ data.channelId +""+ data.permissionId)));
             const index: number = this.finalObjectAttributePermissions.indexOf(data.objectId +""+ data.channelId +""+ data.permissionId);
                                  if(index>=0){
                                  this.finalObjectAttributePermissions.splice(index, 1);
                                  }
              if(createMapData[0].id != undefined && createMapData[0].id >0){
                                  createMapData[0].id = 0;
                                  }
              createMapData[0]["filteredId"] = data.objectId + data.channelId + data.permissionId;
              createMapData[0].permissionId = permissionId;
              createMapData[0].attributeExclutionList=[];
              this.finalObjectAttributePermissions.push(Object.assign({}, createMapData[0]));
              }
      }
      else {
      data['isCreateUpdateAttributePermission']= false;
      if(data.isNewObject==undefined || !data.isNewObject){
                                var existingobjectAttrIndex = this.originalObjectPermissionList.data.responseData[0].objectPermissionList.findIndex(object=>(object.objectId === data.objectId
                                 && object.channelId === data.channelId && object.permissionId === 3));
                                                  if(existingobjectAttrIndex >=0){
                                 var attributeIds = this.originalObjectPermissionList.data.responseData[0].objectPermissionList[existingobjectAttrIndex].attributeExclutionList;
                                  data.attributeExclutionList.forEach(function(element,index){
                            var isExistingAttributeId = attributeIds.findIndex(object=>(object.objectAttributeId === element.objectAttributeId
                             && object.excluded));
                             if(isExistingAttributeId <0){
                                   data.attributeExclutionList[index].excluded = false
                                   }
                                    });
                                 }
                                 }
                                 else{
                   if(data.attributeExclutionList != undefined){
                    data.attributeExclutionList.forEach(function(element,index){
                     data.attributeExclutionList[index].excluded = false;   //set the value
                       });
                       }
                       }
       let createMapData =[];
        data.createFlag = false
        data.updateFlag = false
        data.readFlag=true
        data["filteredId"] = '';
        let permissionIds = [1,2];
         if(data.isAddOrRemoveOrUpdate == undefined || data.isAddOrRemoveOrUpdate != 'ADD'){
              data["isAddOrRemoveOrUpdate"] = 'REMOVE'}
        for(let permissionId of permissionIds){
        // var index = this.finalObjectAttributePermissions.findIndex(object=>(object.filteredId=== (data.objectId +""+ data.channelId +""+ data.permissionId)));
        const index: number = this.finalObjectAttributePermissions.indexOf(data.objectId +""+ data.channelId +""+ data.permissionId);
                                  if(index>=0){
                                  this.finalObjectAttributePermissions.splice(index, 1);
                                  }

        createMapData.push(Object.assign({}, data));
        createMapData[0]["filteredId"] = data.objectId +""+ data.channelId +""+ data.permissionId;
        createMapData[0].permissionId = permissionId;
        createMapData[0].attributeExclutionList=[];
        this.finalObjectAttributePermissions.push(Object.assign({}, createMapData[0]));
        }
      }
    }

   readMap(data, $event) {
             if ($event.checked == true) {
             data['isCreateUpdateAttributePermission']= false;
             let readObjectIndex = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId
                                      && object.channelId === data.channelId && object.permissionId === 3 &&
                                      object.isAddOrRemoveOrUpdate === 'REMOVE'));
                                      if(readObjectIndex!= undefined && readObjectIndex >=0){
                                      this.finalObjectAttributePermissions.splice(readObjectIndex,1);
                                      }

             let createMapData =[];
              data["isAddOrRemoveOrUpdate"] = 'UPDATE'
               data.createFlag = false
               data.updateFlag = false
               data.readFlag=true
               data.status=1;
               data["filteredId"] = '';
               let permissionIds =[3];
               for(let permissionId of permissionIds){
               createMapData.push(Object.assign({}, data));
                //var index = this.finalObjectAttributePermissions.findIndex(object=>(object.filteredId=== (data.objectId +""+ data.channelId +""+ data.permissionId)));
              const index: number = this.finalObjectAttributePermissions.indexOf(data.objectId +""+ data.channelId +""+ data.permissionId);
                    if(index>=0){
                     this.finalObjectAttributePermissions.splice(index, 1);
                             }
               createMapData[0].permissionId = permissionId;
               createMapData[0]["filteredId"] = data.objectId + data.channelId + data.permissionId;
               createMapData[0].attributeExclutionList=[];
               this.finalObjectAttributePermissions.push(Object.assign({}, createMapData[0]));
                             }
             }
             else {
              if(data.isNewObject==undefined || !data.isNewObject){
                          var existingobjectAttrIndex = this.originalObjectPermissionList.data.responseData[0].objectPermissionList.findIndex(object=>(object.objectId === data.objectId
                           && object.channelId === data.channelId && object.permissionId === 3));
                                            if(existingobjectAttrIndex >=0){
                           var attributeIds = this.originalObjectPermissionList.data.responseData[0].objectPermissionList[existingobjectAttrIndex].attributeExclutionList;
                            data.attributeExclutionList.forEach(function(element,index){
                      var isExistingAttributeId = attributeIds.findIndex(object=>(object.objectAttributeId === element.objectAttributeId
                       && object.excluded));
                       if(isExistingAttributeId <0){
                             data.attributeExclutionList[index].excluded = false
                             }
                              });
                           }
                           }
                           else{
             if(data.attributeExclutionList != undefined){
              data.attributeExclutionList.forEach(function(element,index){
               data.attributeExclutionList[index].excluded = false;   //set the value
                 });
                 }
                 }
             data['isCreateUpdateAttributePermission']= true;
              let readObjectIndex1 = this.finalObjectAttributePermissions.findIndex(object=>(object.objectId === data.objectId && object.channelId === data.channelId && object.permissionId === 3 ));
               if(readObjectIndex1 != undefined && readObjectIndex1 >=0){
               this.finalObjectAttributePermissions.splice(readObjectIndex1,1);
               }

             let createMapData =[];
               data.createFlag = false
               data.updateFlag = false
               data.readFlag=false
               data["filteredId"] = '';
                let permissionIds = [1,2,3];
                if(data.isAddOrRemoveOrUpdate == undefined || data.isAddOrRemoveOrUpdate != 'ADD'){
                     data["isAddOrRemoveOrUpdate"] = 'REMOVE'}
                      for(let permissionId of permissionIds){
                       //var index = this.finalObjectAttributePermissions.findIndex(object=>(object.filteredId=== (data.objectId +""+ data.channelId +""+ data.permissionId)));
                      const index: number = this.finalObjectAttributePermissions.indexOf(data.objectId +""+ data.channelId +""+ data.permissionId);
                             if(index>=0){
                                  this.finalObjectAttributePermissions.splice(index, 1);
                                         }
                                    createMapData.push(Object.assign({}, data));
                                    createMapData[0]["filteredId"] = data.objectId +""+ data.channelId +""+ data.permissionId;
                                    createMapData[0].permissionId = permissionId;
                                    createMapData[0].attributeExclutionList=[];
                                    this.finalObjectAttributePermissions.push(Object.assign({}, createMapData[0]));
                                                  }
               data.createFlag=false
             }
           }

  ngOnDestroy(){
  this.dialog.closeAll();
  }
}


@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "./dialog-overview-example-dialogEdit.html",
  styleUrls: ["../../core.user.css"]
})
export class DialogContentExampleDialogEdit implements OnInit {
  modeld: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialogEdit>,
    public roleservice: RolecreateService,private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: PopData
  ) {}
  model1: any = [];
  mFlag: boolean = false;
  wFlag: boolean = false;
  dataSource;
  allFilteredObjects =[];
  mobileDataSource;
  objectList: any;
  objectList2: any;
  channelList=[]
  assignedObjectRolePermissions = this.data.assignedObject;
  ngOnInit() {
    debugger
    this.SpinnerService.show();
    this.roleservice.objectList()
      .subscribe((users: any) => {
        debugger

        this.objectList = users.data
        this.SpinnerService.hide();
        let all={id: undefined, lookupVal: "All", lookupTypeId: 12, status: 1}
        for(let data of this.objectList.referenceData.channelList ){
               this.channelList.push(data)
               console.log(this.channelList,"channellist")
          }
          this.channelList.push(all);

            for(let data of this.objectList.responseData ){

                 let assignedRolePermissions =  _.find(this.assignedObjectRolePermissions, (obj) => (obj.objectId == data.objectId && obj.channelId == data.channelId));
                 let assignedWebPermissions =  _.find(this.data.assignedWebObject, (obj) => (obj.objectId == data.objectId && obj.channelId == data.channelId));
                 let assignedMobilePermissions =  _.find(this.data.assignedMobileObject, (obj) => (obj.objectId == data.objectId && obj.channelId == data.channelId));
                      if(!assignedRolePermissions && !assignedWebPermissions && !assignedMobilePermissions){
                      let assignedObjects = data;
                       if (assignedObjects.channelId==33){
                                        assignedObjects.channelName="Web"
                                      }
                                      else{
                                        assignedObjects.channelName="Mobile"
                                      }
                         this.allFilteredObjects.push(Object.assign({},assignedObjects));
                             }
            }

        this.dataSource =  this.allFilteredObjects;//new MatTableDataSource(this.allFilteredObjects);
        error => console.log(error);
      });
}

  panelOpenState = false;

  displayedColumns: string[] = [
    "entityName",
    "subEntityName",
    "moduleName",
    "select",
    "channel"
  ];
  // data1 = ELEMENT_DATA;
  userFilter: any = { branchCode: "" };

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


  onNoClick(): void {
    this.dialogRef.close();
  }

  objectData() {
    // // debugger;
    var a = this.model1.mobile;
    // this. objectdata =  this.objectList.data.filter(function(object) {
    //  return object.subEntityName == data;
    //});
  }
  mobiledata = [];
  md = 0;


  mobileData(item) {
    var objectdata = this.objectList.data.filter(function(object) {
      return object.subEntityName == item;
    });
    this.mFlag = true;
    this.wFlag = false;
    if (this.model1.mobile == false || this.md === 0) {
      this.md++;
      var data = objectdata.filter(function(object) {
        return object.channelId == 34;
      });
      this.mobiledata = data;
    }
  }


  webdata = [];
  wd = 0;
  webData(item) {
    // // debugger;
    var objectdata = this.objectList.data.filter(function(item) {
      return item.subEntityName == item;
    });

    this.wFlag = true;
    this.mFlag = false;

    if (this.model1.web == false || this.wd === 0) {
      this.wd++;
      // // debugger;
      var data = objectdata.filter(function(object) {
        return object.channelId == 33;
      });
      this.webdata = data;
    }
  }

    channelData(data,val) {
       this.applyFilter(val);
    }




  mobileentity = [];
   mobileEntity(data, $event) {
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
       var object = {  permission:{
         ['CREATE']: {permissionId: Number, permissionType: "CREATE", id: Number, checked: false},
         ['READ']: {permissionId: Number, permissionType: "READ", id: Number, checked: false},
         ['UPDATE']: {permissionId: Number, permissionType: "UPDATE", id: Number, checked: false}
                                                              } };
      if ($event.checked == true) {
      data['permission'] = object.permission;
      data["isAddOrRemoveOrUpdate"] = 'ADD';
        this.mobileentity.push(data);
        for (var i = this.objectList.responseData.length - 1; i >= 0; --i) {
          if (this.objectList.responseData[i].subEntityName == data.subEntityName) {
            this.objectList.responseData.splice(i, 1);
          }
        }
      } else {
        for (var i = this.mobileentity.length - 1; i >= 0; --i) {
          if (this.mobileentity[i].subEntityName == data.subEntityName) {
            this.mobileentity.splice(i, 1);
          }
        }
        this.objectList.responseData.push(data);
      }
    }

  webentity = [];

  webEntity(data, $event) {
    var object = {  permission:{
                  ['CREATE']: {permissionId: Number, permissionType: "CREATE", id: Number, checked: false},
                  ['READ']: {permissionId: Number, permissionType: "READ", id: Number, checked: false},
                  ['UPDATE']: {permissionId: Number, permissionType: "UPDATE", id: Number, checked: false}
                                                         } };
      this.model1.wentity;
      if ($event.checked == true) {
        data['permission'] = object.permission;
        data["isAddOrRemoveOrUpdate"] = 'ADD';
        data.push(object);
        data.attributeExclutionList =[];
        this.webentity.push(data);
        for (var i = this.objectList.data.length - 1; i >= 0; --i) {
          if (this.objectList.data[i].subEntityName == data.subEntityName) {
            this.objectList.data.splice(i, 1);
          }
        }
      } else {
        for (var i = this.webentity.length - 1; i >= 0; --i) {
          if (this.webentity[i].subEntityName == data.subEntityName) {
            this.webentity.splice(i, 1);
          }
        }
        this.objectList.data.push(data);
      }

    console.log(this.mobileentity);
  }

  filterEntity() {
    // // debugger;
    let mobileobject = [];
    let webobject = [];
    mobileobject = this.mobileentity;
    webobject = this.webentity;
    this.dialogRef.close({ webobject, mobileobject });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  //json

  objectList1: any = {
    data: [
      {
        moduleId: 4,
        objectId: 1,
        moduleName: "Credit Contract",
        entityName: "Test",
        subEntityName: "SE1",
        channel: "WEB",
        isPublic: 0,
        permissionId: 0,
        attributeExclutionList: [
          {
            attributeName: "obj1attribute1",
            createdBy: "1",
            updatedBY: "1",
            description: "test description",
            permissionId: 0,
            objectId: 1,
            objectattribute_id: 0,
            obj_role_perm_map_id: 0,
            effectiveDate: "2019-09-09T12:59:35.568+0000",
            id: 1
          }
        ],
        status: 0
      },

      {
        moduleId: 4,
        objectId: 2,
        moduleName: "Credit Contract",
        entityName: "Test",
        subEntityName: "SE2",
        channel: "MOBILE",
        isPublic: 0,
        permissionId: 0,
        attributeExclutionList: [
          {
            attributeName: "obj1attribute1",
            createdBy: "1",
            updatedBY: "1",
            description: "test description",
            permissionId: 0,
            objectId: 1,
            objectattribute_id: 0,
            obj_role_perm_map_id: 0,
            effectiveDate: "2019-09-09T12:59:35.568+0000",
            id: 1
          }
        ],
        status: 0
      }
    ]
  };
}
