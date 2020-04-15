import { Component, OnInit, Inject, HostListener } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { AppSetting } from "../../app.setting";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { RolecreateService } from "./../role/rolecreate.service";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material';
import { AuthorizationService } from "src/app/core/services/authorization.service";
import {UsercreateService} from "src/app/userModule/usercreate/usercreate.service";
import { NgxPermissionsService } from "ngx-permissions";
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { filter } from 'rxjs/operators';
import * as moment from 'moment';

export interface DialogData {}
export interface PeriodicElement {roleId: number,roleName: string, status: number,addOrRemoveOrUpdate:string,
  description:string}

@Component({
  selector: "app-userdetails",
  templateUrl: "./userdetails.component.html",
  styleUrls: ["../../core.user.css"],
  animations: [trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class UserdetailsComponent implements OnInit {

  //email auto complete

  findChoices(searchText: string) {
    return ['safexpress.com'].filter(item =>
      item.toLowerCase().trim().includes(searchText.toLowerCase().trim())
    );
  }

  getChoiceLabel(choice: string) {
    return `@${choice}`;
  }
  //end email auto complete


  DepartmentHierarchyMenu: any = [];
    //mobile number validation
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    //end
    regexp = new RegExp(/^[A-Za-z_0-9.]{2,}@([A-Za-z0-9]{1,}[.]{1}[A-Za-z]{2,6}|[A-Za-z0-9]{1,}[.][A-Za-z]{2,6}[.]{1}[A-Za-z]{2,6})$/);
    emailPattern: boolean = true;
    emailValidation(){
    debugger
      //console.log('this.model.data.email', this.model.data.email);
      this.emailPattern = true;
      if(!this.regexp.test(this.model.data.email.trim())){
        this.emailPattern= true;
        return true
      }
      else{
        this.emailPattern = false;
      }
    }


  ELEMENT_DATA =  [ ];


    //mat-table
    dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    columnsToDisplay = ['roleId', 'roleName','effectiveDate','expiryDate','editOperation',  'status','delete'];
    columnsToDisplay2 = ['name', 'weight', 'symbol', 'position'];
    columnsToDisplay3 = ['name', 'weight', 'symbol', 'position'];
    expandedElement: PeriodicElement | null;
    //mat-table end

  IsCheckedpriv: boolean;
  selFlag: boolean;
  delFlag: boolean;
  isAdminFlag: boolean;

  username: string = "User Name";
  public userm = [];
  userBranch: any;
  userPrivi: any;
  defaultBranch: any = [];
  priviBranchData: any = [];
  DefaultB: any;
  Privillage: any;
  RoleD: any;
  CatData: any = {};
  userCreate: any = {};
  advanceDefaultFilter: any;
  advancePriViFilter: any;
  //permission
  userPermission:any = [];
  rolePermission:any = [];
  objectPermission:any = [];
  todayDt
//end permission

mindateForList:any;
maxdateForList:any;


  category: any = [];
  constructor(
    public toast: ToastrService,
    private roleservice: RolecreateService,private SpinnerService: NgxSpinnerService,
    private httpservice: HttpClient,
    private httpService: HttpClient,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private AuthorizationService:AuthorizationService,
   private permissionsService:NgxPermissionsService,
   private usercreateservice:UsercreateService,
  ) {
    this.IsCheckedpriv = true;
    this.AuthorizationService.getTimeStamp().subscribe(date=>{
      this.todayDt = new Date(date.data.responseData.split("[")[0])
    })
  }

  checkInPriviArryP = (objArray, val) => {
    for (var i = 0; i < objArray.length; i++) {
        if (objArray[i].branchCode.toUpperCase() == val.branchCode.toUpperCase()) {
            return true;
        }
    }
    return false;
  };
  // pup up for Default branch
  openDialog() {
    const dialogRef = this.dialog.open(popforDefaultBranchDetails, {disableClose: true,
      // width:'350px', height:'140px',
    });

    dialogRef.afterClosed().subscribe(result => {

      if(this.checkInPriviArryP(this.testt,result.defaultBranch[0])==true){
        // alert(`${result.defaultBranch[0].branchCode} is already Set as Pravilage Branch...First you need to remove from privillage List`);
        this.toast.warning(`${result.defaultBranch[0].branchCode} is already set as privilege branch...First you need to remove it from the privilege branch list`);
      }
      if(this.checkInPriviArryP(this.testt,result.defaultBranch[0])==false){
        AppSetting.defaultBranchcode=result.defaultBranch[0].branchCode;
        this.SearchTypeDefault=result.SearchTypeDefault;
        this.DefaultB =
          result.defaultBranch[result.defaultBranch.length - 1].branchCode;
        this.model.data.defaultBranch =
          result.defaultBranch[result.defaultBranch.length - 1].branchCode;
          this.model.data.defaultBranchId =
          result.defaultBranch[result.defaultBranch.length - 1].branchId;
        this.model.data.defaultName =
          result.defaultBranch[result.defaultBranch.length - 1].branchName;
        this.priFilter.branchCode =
          result.defaultBranch[result.defaultBranch.length - 1].branchCode;
        this.defaultBranch.branchCode = this.priFilter.branchCode;
        console.log(this.SearchTypeDefault)
      }

    });
  }

  //pop up for Privillage Branch
  // pup up
  openDialogPrivi() {
    const dialogRef = this.dialog.open(popforPriviBranchDetails, {disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
// debugger

      console.log(result);
         this.SearchType =result.SearchTypeDefault;
      let existBranch=[];
      for (let i = 0; i < result.defaultBranch.length; i++) {
        const element = result.defaultBranch[i];
        if(this.todayDt){
          element.effectiveDate_min = this.todayDt;
        }else{
          element.effectiveDate_min = new Date();
          // this.minDateEffe = new Date()
        }

        if(this.checkInPriviArry(this.testt,element)==true){
          console.log('data is duplicate ');
          existBranch.push(element.branchName);
        }
        else{
        element.addOrRemoveOrUpdate='ADD';
        this.testt.push(element);
        }
      }
      if(existBranch.length>0){
        this.toast.warning('Branch Name :'+`   ${existBranch} already exists in List`)
      }
      this.userBranch = result.userBranch;
      this.DefaultB = result.defaultBranch;
    });
  }

  checkInPriviArry = (objArray, val) => {
    for (var i = 0; i < objArray.length; i++) {
        if (objArray[i].branchCode.toUpperCase() == val.branchCode.toUpperCase()) {
            return true;
        }
    }
    return false;
  };

  expiryDateFlag:boolean = true;
  effectiveDateFlag:boolean = true;
  isEditRoleFlag:boolean = true;
  existingEffectiveDateFlag:boolean = true;
  roleExpiryDateFlag:boolean= true;
  roleEffectiveDateFlag:boolean= true;
  editDate = true;
  effectiveDateMessage:String
  expiryDateMessage:String
  saveRevertButton:String = 'Save dates';
  dateChange(event, oldValue, effectiveDate,j, priviarr){
  debugger
  if(this.expiryDateFlag && this.effectiveDateFlag){
  priviarr.saveRevertButton = 'Save dates';
  }
   this.expiryDateMessage = '';
   let d1 = new Date(event);
   let d2 = new Date(oldValue);
   let d3 = new Date(effectiveDate);
      let tomorrow;
      priviarr['newExpiryDate'] = event;
      if(priviarr.newEffectiveDate != undefined){
            tomorrow = moment(priviarr.newEffectiveDate).add(1, 'days').toDate();
            }

            else{
            tomorrow = moment(priviarr.effectiveDate).add(1, 'days').toDate();
            }

      let today = moment(this.convert(this.todayDt)).toDate();
      this.expiryDateMessage ='';
      this.expiryDateFlag = true;
      if(d1.getFullYear() > 9999){
      this.expiryDateFlag = false;
      this.saveRevertButton ='Revert invalid dates';
      priviarr['saveRevertButton'] = 'Revert invalid dates';
      this.expiryDateMessage ='Invalid calender range';
      priviarr.expiryDate_max = new Date(this.convert('01/01/9999'));
      }
      if(d3.getFullYear() > 9999){
      this.expiryDateFlag = false;
         this.saveRevertButton ='Revert invalid dates';
         priviarr['saveRevertButton'] = 'Revert invalid dates';
         this.effectiveDateMessage ='Invalid calender range';
         priviarr.effectiveDate_max = new Date(this.convert('01/01/9999'));
         }

       if((d1.getTime() >= d2.getTime()) || (d1.getTime() >= d3.getTime())){
         if((priviarr.newExpiryDate < priviarr.newEffectiveDate)){
         this.expiryDateFlag = false;
         this.saveRevertButton ='Revert invalid dates';
         priviarr['saveRevertButton'] = 'Revert invalid dates';
         this.expiryDateMessage ='Invalid date range';
         }
         else if(priviarr.newExpiryDate < d3){
         this.expiryDateFlag = false;
         this.saveRevertButton ='Revert invalid dates';
         priviarr['saveRevertButton'] = 'Revert invalid dates';
         this.expiryDateMessage ='Invalid date range';
         }

         else if(d1 < today){
               this.expiryDateFlag = false;
               this.saveRevertButton ='Revert invalid dates';
               priviarr['saveRevertButton'] = 'Revert invalid dates';
               this.expiryDateMessage ='Expiry date cannot be in the past';
               }
         else if(d3 < event){
         priviarr.expiryDate = event;
         priviarr.saveRevertButton = 'Save dates';
         }

         }
         else if((d1.getTime() <= d3.getTime()) ){
               priviarr.newExpiryDate = event;
               this.saveRevertButton ='Revert invalid dates';
               this.expiryDateFlag = false;
               priviarr['saveRevertButton'] = 'Revert invalid dates';
               if(d3 >= today){
               priviarr.expiryDate_min = moment(today).add(1, 'days').toDate();
               }
               this.expiryDateMessage ='Exp. date should be greater than Eff. date';
         }
         else{
         this.saveRevertButton ='Save dates';
         priviarr['saveRevertButton'] = 'Save dates';
         priviarr.expiryDate = event;
         this.expiryDateFlag = true;
         priviarr.newExpiryDate = event;
         }
  }

  dateChangeEffectiveDate(event, oldValue, expiryDate,j, priviarr){
   debugger
    if(this.expiryDateFlag && this.effectiveDateFlag){
     priviarr['saveRevertButton'] = 'Save dates';
     }
       let temp = this.convert(event);
       let today = this.convert(this.todayDt);
       let d1 = moment(new Date(temp),"dd/MM/yyyy") ;
       let d2 = moment(new Date(oldValue),"dd/MM/yyyy") ;
       let d3 =  moment(new Date(expiryDate),"dd/MM/yyyy") ;
       let d4 =  moment( new Date(today),"dd/MM/yyyy") ;
       this.saveRevertButton ='Save dates';
       priviarr['saveRevertButton'] = 'Save dates';
       priviarr['newEffectiveDate'] = event;
       this.effectiveDateFlag = false;
          if(d3.year() >9999){
          priviarr.expiryDate_max = new Date(this.convert('01/01/9999'));
          this.expiryDateFlag = false;
          this.expiryDateMessage ='Invalid calender range';
          priviarr['saveRevertButton'] = 'Revert invalid dates';
          this.saveRevertButton ='Revert invalid dates';
          }
          if(null == event || d1.year() > 9999){
           if(event==null){
                   priviarr.effectiveDate_max = new Date(this.convert('01/01/9999'));
                   this.effectiveDateMessage ='Effective date is mandatory';
                   }else{
            priviarr.effectiveDate_max = new Date(this.convert('01/01/9999'));
            this.effectiveDateFlag = false;
            this.saveRevertButton ='Revert invalid dates';
            priviarr['saveRevertButton'] = 'Revert invalid dates';
            this.effectiveDateMessage ='Invalid calender range';}
            }

        if((d1 == d2) || (d1 >= d4)){
        this.existingEffectiveDateFlag=true;
         priviarr.effectiveDate = this.convert(event);
         if( new Date(priviarr.effectiveDate) >= new Date(today)){
           priviarr.effectiveDate_min = new Date(today);

         }
        this.effectiveDateFlag = true;
        this.expiryDateFlag = true;
        let tomorrow = moment(priviarr.effectiveDate).add(1, 'days').toDate();
        priviarr.expiryDate_min = new Date(this.convert(tomorrow));
         if(new Date(priviarr.expiryDate) <= new Date(tomorrow)){
           this.expiryDateFlag = false;
           this.saveRevertButton ='Revert invalid dates';
           priviarr['saveRevertButton'] = 'Revert invalid dates';
           this.expiryDateMessage = 'Expiry date cannot be in the past';
           priviarr.expiryDate_min = new Date(this.convert(tomorrow));
         }
         else if((new Date(priviarr.expiryDate) <= priviarr.newEffectiveDate) ||
          (priviarr.newExpiryDate <= priviarr.newEffectiveDate)){
         this.expiryDateFlag = false;
         this.saveRevertButton ='Revert Invalid dates';
         priviarr['saveRevertButton'] = 'Revert invalid dates';
         this.expiryDateMessage = 'Expiry date cannot be in past';
         //please check and test Priyanka
         priviarr.expiryDate_min = new Date(this.convert(tomorrow));
         }
   }
         else if((!priviarr.isNewBranch && d1<d2) || d1 <d4){
          this.effectiveDateFlag = true;
          this.expiryDateFlag = true;
           priviarr.saveRevertButton = 'Save dates';
         if(d1 <d4){
         if(event==null){
         priviarr.effectiveDate_min = new Date(today);
          this.effectiveDateFlag = false;
          this.effectiveDateMessage ='Effective date is mandatory';
            }
          else{
         this.effectiveDateFlag = false;
         this.saveRevertButton ='Revert invalid dates';
         priviarr.effectiveDate_min = new Date(today);
         priviarr['saveRevertButton'] = 'Revert invalid dates';
         this.effectiveDateMessage = 'Effective date cannot be in the past';
         this.existingEffectiveDateFlag = true;
         }
         }
         else if(d1 < priviarr.newExpiryDate){
         //priviarr.effectiveDate = priviarr.effectiveDate;
         this.effectiveDateFlag = false;
         priviarr.effectiveDate_min = new Date(today);
         this.saveRevertButton ='Revert invalid dates';
         priviarr['saveRevertButton'] = 'Revert invalid dates';
         this.effectiveDateMessage='Effective date cannot be in past';
         this.existingEffectiveDateFlag=true;
         }
         else{
          //  this.toast.warning('Effective date cannot be back dated, save will revert it to previous state');
             priviarr.effectiveDate = this.convert(priviarr.effectiveDate);
              priviarr.saveRevertButton = 'Save dates';
                  let tomorrow = moment(priviarr.effectiveDate).add(1, 'days').toDate();
                  priviarr.expiryDate_min = new Date(this.convert(tomorrow));
                   if(new Date(priviarr.expiryDate) <= new Date(tomorrow)){
                     this.expiryDateFlag = false;
                     priviarr['saveRevertButton'] = 'Revert invalid dates';
                     this.saveRevertButton ='Revert invalid dates';
                     this.expiryDateMessage = 'invalid expiry date';
                     priviarr.expiryDate_min = new Date(this.convert(tomorrow));
                   }
                  }
                  }
                  else if( d1<d4){
                   priviarr.effectiveDate = d1;
                   this.saveRevertButton ='Revert invalid dates';
                   priviarr['saveRevertButton'] = 'Revert invalid dates';
                  this.existingEffectiveDateFlag = true;
                  let tomorrow = moment(priviarr.effectiveDate).add(1, 'days').toDate();
                    this.effectiveDateMessage = 'Effective date cannot be in the past';
                    priviarr.effective_min = new Date(this.convert(d4));
                    priviarr.expiryDate_min = new Date(this.convert(tomorrow));
                                  }
   }
  existingExpDateFlag:boolean = true;

   dateChangeOnRoleEdit(event, oldValue, effectiveDate, element, modelExp){
       let temp = this.convert(event);
       let today = this.convert(this.todayDt);
       let d1 = new Date(temp).getTime() ;
       let d2 = new Date(element.expiryDateOld).getTime();
       let d3 = new Date(element.effectiveDate).getTime();
       this.expiryDateFlag = false;
       this.existingExpDateFlag = false;
       if(modelExp.valid){
         this.expiryDateFlag = true;
         this.existingExpDateFlag = true;
         // this.expBlur();
       }else {
         if(d1 == d2 ){
           // this.expiryDateFlag = true;
           // this.existingExpDateFlag = true;
          //  this.expBlur();
          if(d1 > d3){
           this.expiryDateFlag = true;
           this.existingExpDateFlag = true;
          }
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

  SearchType:string
  SearchTypeDefault:string;
  userId = "";
  testt: any = [];
  userdata: any = {};
  roledata: any = [];
  CurrentDefault: string;
  priviBranchdata = [];
  userFilter: any = { branchCode: "" };
  priFilter: any = { branchCode: "" };
  roleFilter: any = { roleName: "" };
  privillageData = {
    data: []
  };
   clonedPrivilegeBranchData: any = [];
   clonedUserRoleData: any = [];
  newdata: any = {}

  model: any = {
    data: [
      {
        id: 0,
        userId: "",
        name: "",
        email: "",
        mobile: "",
        categoryId: 0,
        status: "1",
        isAdmin: 0,
        menuHierarchyId: '',
        userDepartment:'',
        defaultBranch: {
          branchCode: "",
          isDefault: 1
        }
      }
    ],
    refernceList: {
      categoryList: [
        {
          lookupVal: "",
          lookupTypeId: 50,
          status: 1,
          id: 145
        },
        {
          lookupVal: "",
          lookupTypeId: 50,
          status: 1,
          id: 146
        }
      ],
      branch: [
        {
          branchCode: "ABO04",
          branchName: "ABOHAR-04",
          phone: "01123565379",
          mobile: "999999999",
          email: "agartalaChandigarh@safexpress.com",
          isDefault: 1,
          address: "Chandigarh",
          cutoffTime: 0,
          organisationId: 0,
          branchtypeId: 4,
          autogenWaybl: 1,
          branchRating: "top10",
          lagTime: 0,
          descr: "sds",
          status: 1,
          expiryDate: "2020-10-23T18:30:00.000+0000",
          effectiveDate: "2019-10-17T09:13:40.954+0000"
        }
      ],
      userRoles: [
        {
          addOrRemoveOrUpdate: "add",
          createdBy: "",
          description: "",
          effectiveDate: "2019-11-25",
          expiryDate: "2020-11-24",
          roleId: 0,
          roleName: "",
          status: 0,
          updatedBy: ""
        }
      ]
    }
  };

  // privillage branch
  privi: any = {
    data: [
      {
        branchId: 3,
        parentBranchId: 0,
        branchCode: "AGT101",
        branchName: "AGARTALA-101",
        isDefault: 0
      },
      {
        branchId: 4,
        parentBranchId: 0,
        branchCode: "4AGT101",
        branchName: "AGARTALA-101",
        isDefault: 0
      }
    ]
  };
  //end
  catD: any;
  defaultBranchId: '';
  userdetail: any;
  roleTodayDate : any;
  ngOnInit() {
    this.getMenuHierarchy();
    this.DefaultData();
    this.privillage();
    this.role();
    this.RoleData();
    this.DepartmentList();
    this.permissionsService.loadPermissions(this.AuthorizationService.getPermissions('user'));
      //end permission
    this.SpinnerService.show();
    var userId: any;
    this.route.params.subscribe(params => {
      userId = params["userId"];

      const headers = new HttpHeaders({correlationId: "1",branchCode: "1",journeyId: "1",userId: userId,
        originUserType: "1"});
      this.httpservice
        .get(window['config'].API_ENDPOINT + "secure/v1/users/" + userId, {headers: headers})
        .subscribe(data => {
          let success: any = {};
          success = data;
          this.category = success.data.referenceData.userCategoryList;
          this.userdetail = data;
          this.SpinnerService.hide();
          let d=success.data.responseData
          // for (let d of success.data) {
          //priyanka
            this.defaultBranchId = d.defaultBranch.branchId;
            this.model.data.userId = d.userId;
            this.model.data.id = d.id;
            this.model.data.name = d.name;
            this.validateUser(this.model.data.name)
            this.model.data.email = d.email;
            this.model.data.isAdmin =  (d.isAdmin == 1) ? true : false
            this.emailValidation();
            this.model.data.mobile = d.mobile;
            this.model.data.defaultBranchId = d.defaultBranch.branchId;

            this.model.data.userDepartment = d.userDepartment;
           /**   if(this.DptList.length > 0){
                this.DptList.forEach(element => {
                  if(element.id == d.userDepartment){
                    this.model.data.userDepartment = d.userDepartment;
                  }
                  });
              }
              if(this.DepartmentHierarchyMenu.length > 0){
                this.DepartmentHierarchyMenu.forEach(element => {
                  if(element.id == d.menuHierarchyId){
                    this.model.data.menuHierarchyId = d.menuHierarchyId;
                  }
                });
              }**/
            this.model.data.menuHierarchyId = d.menuHierarchyId;
            this.catD = d.categoryId;
            this.model.data.categoryId = d.categoryId;
            this.model.data.status = d.status;
          // }
          this.model.data.defaultBranch = success.data.referenceData.branch[0].branchName;
          AppSetting.defaultBranchcode=success.data.referenceData.branch[0].branchCode;
          this.priFilter.branchCode=success.data.referenceData.branch[0].branchCode;

          for (let e of success.data.referenceData.userCategoryList) {
            if (this.catD == e.id) {
              this.model.categoryId = e.lookupVal;
              break;
            }
          }
          let dptLookup=this.userdetail.data.referenceData.userDepartmentList;
          for (var i = 0; i < dptLookup.length; i++) {
              if (dptLookup[i].id == this.model.data.userDepartment) {
                this.model.data.userDepartment=dptLookup[i].lookupVal;
              }
          }

           if(this.userdetail.data.referenceData.branch[0].status ==0){
             this.toast.error('400 ', this.userdetail.data.referenceData.branch[0].branchName + 'Default branch is not active in propel-i, please assign an active branch');
                    }
    });
});
    var dt = new Date();
    dt.setDate(dt.getDate() + 1);
    this.expiryDt = dt;

    this.isAdminFlag = JSON.parse(sessionStorage.getItem("all")).data.responseData.user.isAdmin;

}
  adminCheck(event){
  this.model.data.isAdmin = (event.checked == true) ? 1 : 0;
  console.log('this.model.data.isAdmin', this.model.data.isAdmin);
  }
  DptList:any = [];
  DepartmentList(){
    this.usercreateservice.GetDepartmentList().subscribe((users: any) => {
      this.DptList=users.data.responseData;
    });
  }
// Hirarchy Menu
getMenuHierarchy(){
  this.usercreateservice.getMenuHierarchList().subscribe((res:any ) => {
      if(res.status == "SUCCESS"){
      this.DepartmentHierarchyMenu = res.data.responseData;
    }else if(res.status == "FAILURE"){
        this.toast.error(`${res.error.error[0].code} : ${res.error.error[0].description}`);
    }
  })
  error => this.toast.error(`${error.error[0].code} : ${error.error[0].description}`);
}

validNameFlag: boolean = false;
validateUser(nameobj){
 let name = nameobj.trim();
  if(name.length > 2){
    this.validNameFlag = true;
    // return true;
  }else {
    this.validNameFlag = false;
  }

}

trimUserName(){
  this.model.data.name =  this.model.data.name.trim();
}
validateRole(){
  if(this.userRoles.length > 0){
    return true;
  }else {
    return false;
  }
}

  //  validate for atleast one Role is checked
  roleSubmitDis: boolean;
  validateRoleAtleastOne(){
     this.roleSubmitDis = false;
    if( this.roledata.length == this.postRoleData.length ){
      this.roleSubmitDis = true;
      this.roledata.filter(obj => {
        if(obj.addOrRemoveOrUpdate  == 'add'){
          this.roleSubmitDis = false;
        }
      });

    }
    return this.roleSubmitDis;
  }
//  validate for atleast one Role is checked


  privilegeBranchPanel: boolean = false;

            openPrivilegeBranchPanel(){
            this.privilegeBranchPanel = true;
            }
            closePrivilegeBranchPanel(){
            this.privilegeBranchPanel = false;
            }

  isRoleMappingPanelOpen: boolean = false;

             roleMappingPanelOpenState(){
             this.isRoleMappingPanelOpen = true;
                      }
             roleMappingPanelCloseState(){
             this.isRoleMappingPanelOpen = false;
                      }

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.ctrlKey && (event.keyCode === 83)) {
          event.preventDefault();
          if(document.getElementById('branchSave')){
          let element: HTMLElement = document.getElementById('branchSave') as HTMLElement;
          element.click();
          }
          else if(this.privilegeBranchPanel && document.getElementById('privilegeSubmitButton')){
          let element: HTMLElement = document.getElementById('privilegeSubmitButton') as HTMLElement;
          element.click();
          }
          else if(this.isRoleMappingPanelOpen && document.getElementById('roleSubmitButton')){
                  let element: HTMLElement = document.getElementById('roleSubmitButton') as HTMLElement;
                  element.click();
                  }
          else {
                  let element: HTMLElement = document.getElementById('submitButton') as HTMLElement;
                  element.click();
                  }
           }
    }
  // status
  status: any = [
    { lookup: "ACTIVE", value: 1 },
    { lookup: "INACTIVE", value: 0 }
  ];

  editdata;
  editUserRoleData;
  editBranchData;
  editUser() {
  let addOrRemoveOrUpdate ='';
  if(this.defaultBranchId != this.model.data.defaultBranchId){
  addOrRemoveOrUpdate = "ADD";
  }
    var defaultBranch = {
      addOrRemoveOrUpdate: addOrRemoveOrUpdate ,
      branchId: this.model.data.defaultBranchId,
      isDefault: 1
    };
      this.model.data.isAdmin = (this.model.data.isAdmin) ? 1 : 0;
    this.newdata.addOrRemove = "add";
    this.newdata.isDefault = 1;
    this.editdata = {
      id: this.model.data.id,
      menuHierarchyId: this.model.data.menuHierarchyId,
      userId: this.model.data.userId,
      isAdmin: this.model.data.isAdmin,
      name: this.model.data.name,
      email: this.model.data.email,
      mobile: this.model.data.mobile,
      status: this.model.data.status,
      userDepartment:this.model.data.userDepartment,
      categoryId: this.model.data.categoryId,
      defaultBranch: defaultBranch,
      userRoles: [
        {
          addOrRemoveOrUpdate: "add",
          createdBy: "",
          description: "",
          effectiveDate: "2019-11-25",
          expiryDate: "2020-11-24",
          roleId: 0,
          roleName: "",
          status: 1,
          updatedBy: ""
        }
      ]
    };
    let dptLookup=this.userdetail.data.referenceData.userDepartmentList;
    for (var i = 0; i < dptLookup.length; i++) {
        if (dptLookup[i].lookupVal == this.model.data.userDepartment) {
          this.editdata.userDepartment=dptLookup[i].id;
        }
    }

    var headers = {
      branchCode: "B1",
      journeyId: "A1",
      userId: this.model.data.userId
    };

    this.httpservice
      .put<any>(window['config'].API_ENDPOINT + "secure/v1/users", this.editdata, {
        headers: headers
      })
      .subscribe(data => {
        let ob = ErrorConstants.validateException(data);
        // debugger;
        if(ob.isSuccess){
          this.router.navigate(["user-management/user"]);
        }
        else{
          this.toast.warning(ob.message,ob.code);
        }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }
  privilength;
  prividata;

  privillage() {
// debugger
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    var userId: any;
    this.route.params.subscribe(params => {
      if (params["userId"]) {
        userId = params["userId"];
      }
    });
    var headers;
    headers = new HttpHeaders({
      branchCode: "Delhi",
      journeyId: "mumbai",
      userId: userId
    });
    this.httpService
      .get<any>
      (
        window['config'].API_ENDPOINT +
          "secure/v1/users/" +
          userId +
          "/privilegeBranchIDs",
        { headers: headers }
      )
      .subscribe(data => {
        // let ob = ErrorConstants.validateException(data);
          // // debugger;
        //   if(ob.isSuccess){

            this.clonedPrivilegeBranchData = Object.assign([], data.data.responseData);
            this.testt = data.data.referenceData.branch;
            this.testt.forEach(element => {
              data.data.responseData.forEach(elementt => {
                if(element.branchId==elementt.branchId){
                  // effective
                  element.effectiveDate = elementt.effectiveDate;
                  if(this.todayDt){ //if server time persist
                    element.effectiveDate_min = this.todayDt;
                    element.expiryDate_min = this.todayDt;
                  }else{
                    element.effectiveDate_min = new Date();
                    element.expiryDate_min = new Date();
                  }
                  element.effectiveDate_max = null;

                  // expiry
                  element.expiryDate = elementt.expiryDate;

                  element.expiryDate_max = null;
                  element.save = true;
                  element.saveDateFlg = false;


                }
              });
            });
            this.prividata =data.data.referenceData.branch;
            this.privilength = this.testt.length;
          // }
          // else{
          //   this.toast.warning(ob.message, ob.code);
          // }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }

  priviEditData;
  privillageArr = [];
  privilageBranchEdit() {
    // debugger
   // debugger
    var privillageArr = [];
    var privilageBranch;
    this.prividata=this.testt;
    // debugger
    for (let i = 0; i < this.prividata.length; i++) {
      if(this.prividata[i].addOrRemoveOrUpdate=='Remove'){
        privilageBranch = {
            addOrRemoveOrUpdate: "Remove",
            branchId: this.prividata[i].branchId,
            // branchCode: this.prividata[i].branchCode,
            isDefault: 0,
            effectiveDate: this.prividata[i].effectiveDate,
            expiryDate: this.prividata[i].expiryDate,
            // effectiveDate: '2019-11-04T14:28:30.147Z',
            //  expiryDate:'2029-11-04T14:28:30.147Z',
            status:1
        };
        privillageArr.push(privilageBranch);
      }
      if(this.prividata[i].addOrRemoveOrUpdate=='ADD'){
        privilageBranch = {
            addOrRemoveOrUpdate: "ADD",
            branchId: this.prividata[i].branchId,
            // branchCode: this.prividata[i].branchCode,
            isDefault: 0,
            // effectiveDate: this.prividata[i].effectiveDate,
            // expiryDate: this.prividata[i].expiryDate,
            effectiveDate: '2019-11-04T14:28:30.147Z',
            expiryDate:'2029-11-04T14:28:30.147Z',
            status:1
        };
        privillageArr.push(privilageBranch);
      }

      if(this.prividata[i].addOrRemoveOrUpdate=='Update'){
        privilageBranch = {
            addOrRemoveOrUpdate: "Update",
            // branchCode: this.priviBranchdata[i].branchCode,
            branchId: this.prividata[i].branchId,
            // branchCode: this.prividata[i].branchCode,
            isDefault: 0,
            effectiveDate: this.prividata[i].effectiveDate,
            expiryDate: this.prividata[i].expiryDate,
            status:1
        };
        privillageArr.push(privilageBranch);
      }

    }
console.log(privillageArr +'  dATA');
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    var headers;
    var uid: any;
    this.route.params.subscribe(params => {
      if (params["userId"]) {
        uid = params["userId"];
      }
    });

    headers = new HttpHeaders({
      branchCode: "Delhi",
      journeyId: "mumbai",
      userId: uid
    });

      this.model.data.isAdmin = (this.model.data.isAdmin) ? 1 : 0;
      this.editBranchData = {
            id: this.model.data.id,
            menuHierarchyId: this.model.data.menuHierarchyId,
            userId: this.model.data.userId,
            name: this.model.data.name,
            email: this.model.data.email,
            mobile: this.model.data.mobile,
            status: this.model.data.status,
            userDepartment:this.model.data.userDepartment,
            categoryId: this.model.data.categoryId,
            previlegeBranches :  this.prividata
          };
              let dptLookup=this.userdetail.data.referenceData.userDepartmentList;
              for (var i = 0; i < dptLookup.length; i++) {
                  if (dptLookup[i].lookupVal == this.model.data.userDepartment) {
                    this.editBranchData.userDepartment=dptLookup[i].id;
                    break;
                  }

              }
    this.httpService
      .put<any>(
        window['config'].API_ENDPOINT +
          `secure/v1/users/privilegeBranchIds`,
        this.editBranchData,
        { headers: headers }
      )
      .subscribe(data => {
        let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.router.navigate(["user-management/user"]);
        }
        else{
          this.toast.warning(ob.message,ob.code);
        }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }


  effectiveDate;
  expiryDt;
  eff_dt_mx_range;

  validDt = true;
  currentEffectDt;
  curretnExpirytDt;


runEffective(v){
  this.validDt = true;
  this.currentEffectDt = v;
  var exp_dt = new Date(v.value);
  exp_dt.setDate(exp_dt.getDate() + 1);
  this.expiryDt = exp_dt;
}

// run on expiry dt change
// v is date of selected by client
// effective date should not be greater then effective date
// this field disable effective all date
runExpiry(v){
  this.validDt = true;
  this.curretnExpirytDt = v;
  var eff_dt_mx_range_ = new Date(v.value);
  eff_dt_mx_range_.setDate(eff_dt_mx_range_.getDate() - 1);
  this.eff_dt_mx_range =  eff_dt_mx_range_;
}




//toggle submit button if date is valid or not
  submitBtn:boolean = true;
  ActsaveBtnList = [];

  //compare date on text enter
  //compare date on text enter
 compareDt(whichItem, manualEntDt,  fildType) {
  //handle empty fild
  this.emptyhandly(whichItem)
  this.ActsaveBtnList = this.testt.filter(v => v.saveDateFlg == true)
    // debugger
      // if effective date is selected
      if(fildType == 'effective'){
            if(
                moment(whichItem.effectiveDate).isValid() &&
                moment(whichItem.expiryDate).isValid()  &&
                moment(whichItem.effectiveDate).isBefore(whichItem.expiryDate) &&
                moment(new Date(whichItem.effectiveDate).setHours(0,0,0,0)).isSameOrAfter(this.todayDt.setHours(0,0,0,0))
                ){
                whichItem.save =  true; // date is valid
                this.submitBtn = true; // show submit button
            }else{
                whichItem.save =  false; // date is not valid
                this.submitBtn = false; // hide submit butto
            }

      }

      // if expiry date is selected
      if(fildType == 'expiry'){
        if(
          moment(whichItem.effectiveDate).isValid() &&
          moment(whichItem.expiryDate).isValid() &&
          moment(whichItem.effectiveDate).isBefore(whichItem.expiryDate)
          ){
          whichItem.save =  true; // date is valid
          this.submitBtn = true; // show submit button
        }else{
          whichItem.save =  false; // date is not valid
          this.submitBtn = false; // hide submit butto
        }
      }








    // whichItem.
    let mkDt = manualEntDt.target.value;
    var timestamp = Date.parse(mkDt);

   if (isNaN(timestamp) == false) { //if date is valid
      if(fildType == 'effective'){ // if effective date selected
            // whichItem.effectiveDate_min =   moment(whichItem.effectiveDate).add(1, 'days').toDate();
            whichItem.expiryDate_min =   moment(whichItem.effectiveDate).add(1, 'days').toDate();
      } else if(fildType == 'expiry'){ // if expire date select
            whichItem.effectiveDate_max =  moment(whichItem.expiryDate).subtract(1, 'days').toDate();
      }
  }


  // min max effective date change
    if(moment(new Date(whichItem.effectiveDate).setHours(0,0,0,0)).isSameOrBefore(this.todayDt.setHours(0,0,0,0))){
          whichItem.effectiveDate_min = this.todayDt

    }
    if(moment(new Date(whichItem.expiryDate).setHours(0,0,0,0)).isSameOrBefore(this.todayDt.setHours(0,0,0,0))){
      whichItem.effectiveDate_min = this.todayDt
          whichItem.effectiveDate_max = moment(this.todayDt).add(1000, 'days').toDate()
    }
}


emptyMsg :string = '';
emptyhandly(whichItem){
  this.emptyMsg = ''
  if( !whichItem.effectiveDate ){
    this.emptyMsg = 'Effective date is mandatory.'
    return;
  }else if(!whichItem.expiryDate){
    whichItem.expiryDate =  moment(whichItem.effectiveDate).add(10, 'years').toDate();
    whichItem.save = true;
    // return
  }
}

  priviFlag: boolean = false;
  indexval;
  priviEffect(whichItem, data) {
    // Add From Pradeep
    this.expiryDateFlag= true;
    this.effectiveDateFlag= true;
    // End From Pradeep
    whichItem.saveDateFlg = true;
    this.ActsaveBtnList = this.testt.filter(v => v.saveDateFlg == true)
    this.priviFlag = true;
    this.indexval = data;
  }

    editRoleEffectiveDate(whichItem, data) {
      // Add From Pradeep
      this.roleExpiryDateFlag= true;
      this.roleEffectiveDateFlag= true;
      whichItem.editDate = true;
      whichItem.saveIcon = true;
      this.isEditRoleFlag = false;
      // End From Pradeep
      this.indexval = data;
    }

  savePriviBranchChanged(whichItem, vall, j) {
    whichItem.saveDateFlg = false;
     var originalPrivilegeBranchData = this.clonedPrivilegeBranchData.findIndex(object=>(object.branchId === whichItem.branchId));
        if(!this.effectiveDateFlag || !this.expiryDateFlag){
        if(originalPrivilegeBranchData >=0){
        for (let i = 0; i < this.testt.length; i++) {
              const element = this.testt[i];
              if (element.branchId == whichItem.branchId) {
                element['saveRevertButton'] = 'Save dates';
                element.effectiveDate = this.convert(this.clonedPrivilegeBranchData[originalPrivilegeBranchData].effectiveDate);
                element.expiryDate = this.convert(this.clonedPrivilegeBranchData[originalPrivilegeBranchData].expiryDate);
                element.addOrRemoveOrUpdate= "Update"
                this.testt[i].saveDateFlg = false;
              }
            }
            }
            else{
               for (let i = 0; i < this.testt.length; i++) {
                  const element = this.testt[i];
                    if (element.branchId == whichItem.branchId) {
                    element['saveRevertButton'] = 'Save dates';
                    element.effectiveDate = this.convert(this.todayDt);
                    element.expiryDate = this.convert(moment(this.todayDt).add(10, 'years').toDate());
                    element.addOrRemoveOrUpdate= "Update"
                    this.testt[i].saveDateFlg = false;
                                      }
                              }
                  }
          this.ActsaveBtnList = this.testt.filter(v => v.saveDateFlg == true)
          this.submitBtn =true;
          }
        else{

        this.existingEffectiveDateFlag=true;
        this.priviFlag = true;
        for (let i = 0; i < this.testt.length; i++) {
          const element = this.testt[i];
          if (element.branchCode == vall) {
            element['saveRevertButton'] = 'Save dates';
            element.effectiveDate = this.convert(this.testt[i].effectiveDate);
            element.expiryDate = this.convert(this.testt[i].expiryDate);
            element.addOrRemoveOrUpdate= "Update"
            this.testt[i].saveDateFlg = false;
          }

        }
        this.ActsaveBtnList = this.testt.filter(v => v.saveDateFlg == true)
        this.submitBtn = true;
        }
        this.indexval = -1;

  }

roleSrchData=[];
  roleSearchFilter(str) {
    if(str){
     str = str.term;
     if(str.length > 2 && str){
       let roledata=[...this.RoleD.responseData];
      //  let temp =  roledata.filter(o =>o.roleName.toLowerCase().startsWith(str.toLowerCase()));
       let temp =  roledata.filter(o =>o.roleName.toLowerCase());
         this.roleSrchData =  temp;
     }else{
       this.roleSrchData = [];
     }
    }else{
       this.roleSrchData = [];
    }
 }

  userRoles = [];
  roledata1 = [];
  postRoleData=[]
  selectedRole : any;
  onroleBranchChanged(obj) {
    let val = obj.roleName;
    for (let i = 0; i < this.RoleD.responseData.length; i++) {
      if (this.RoleD.responseData[i].roleName == val) {
        if(this.checkInRoleArry(this.roledata,val)==true){
          this.toast.warning('Note: Role already in list...!!');
          this.roleFilter.roleName ="";
          this.selectedRole ='';
        }
        else{
          var arr = this.RoleD.responseData[i];
          arr.isNewRole = true;
          arr["addOrRemoveOrUpdate"] = "add";
          arr.effectiveDate_min = this.todayDt;
          arr.effectiveDate = this.todayDt;
          let tomorrow = moment(arr.effectiveDate).add(1, 'days').toDate();
          arr.expiryDate_min = new Date(this.convert(tomorrow));
          arr.expiryDate = moment(arr.effectiveDate).add(10, 'years').toDate();
          arr['roleChecked']=true;
          arr.effectiveDate = new Date();
          arr.expiryDate = moment(arr.effectiveDate).add(10, 'years').toDate();
          this.userRoles.push(arr);
          this.roledata.push(arr);
          // this.ELEMENT_DATA.push(arr)
          this.postRoleData.push(arr)
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.RoleD.responseData.splice(i,1);
          this.roleFilter.roleName = "";
          this.selectedRole ='';
          break;
        }
      }
    }
  }

  roleBranchEdit() {
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    // var userId:any;
    var headers;
    var uid: any;
    this.route.params.subscribe(params => {
      if (params["userId"]) {
        uid = params["userId"];
      }
    });
    headers = new HttpHeaders({
      branchCode: "Delhi",
      journeyId: "mumbai",
      userId: uid
    });
    this.model.data.isAdmin = (this.model.data.isAdmin) ? 1 : 0;
    this.editUserRoleData = {
                id: this.model.data.id,
                menuHierarchyId: this.model.data.menuHierarchyId,
                userId: this.model.data.userId,
                name: this.model.data.name,
                email: this.model.data.email,
                mobile: this.model.data.mobile,
                status: this.model.data.status,
                userDepartment:this.model.data.userDepartment,
                categoryId: this.model.data.categoryId,
                userRoles:  this.postRoleData
              };
                  let dptLookup=this.userdetail.data.referenceData.userDepartmentList;
                  for (var i = 0; i < dptLookup.length; i++) {
                      if (dptLookup[i].lookupVal == this.model.data.userDepartment) {
                        this.editUserRoleData.userDepartment=dptLookup[i].id;
                        break;
                      }

                      //  not use else block pradeep
                      // else{
                      //   this.editUserRoleData.userDepartment='';
                      //   this.model.data.userDepartment='';
                      // }
                  }
    this.httpService
      .put<any>(
        window['config'].API_ENDPOINT +
        `secure/v1/users/roles`,
        this.editUserRoleData,
        { headers: headers }
      )
      .subscribe(data => {
        let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.router.navigate(["user-management/user"]);
        }
        else{
          this.toast.warning(ob.message, ob.code);
        }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }







  RoleData() {
    var headers = new HttpHeaders({
      branchCode: "B1",
      journeyId: "A1",
      userId: "User1"
    });
    debugger
    this.httpservice
      .get<any>(window['config'].API_ENDPOINT + "secure/v1/roles", { headers: headers })
      .subscribe(data => {
        debugger
        let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.RoleD = data.data;
        }
        else{
          this.toast.warning(ob.message, ob.code);
        }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }
  rolelength;
  role() {
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    var headers;
    var userId: any;
    this.route.params.subscribe(params => {
      if (params["userId"]) {
        userId = params["userId"];
      }
    });
    headers = new HttpHeaders({
      branchCode: "Delhi",
      journeyId: "mumbai",
      userId: userId
    });
    this.httpService
      .get<any>(
        window['config'].API_ENDPOINT + "secure/v1/users/" + userId + "/roles",
        { headers: headers }
      )
      .subscribe(data => {
        debugger
        let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.clonedUserRoleData =JSON.parse(JSON.stringify(data.data));
         // this.clonedUserRoleData = Object.assign({}, data.data);
          this.roledata = data.data.responseData;
          this.roledata.map(v=>{
            v.checked=true;
            v.effectiveDate_min = this.todayDt;
            if(v.effectiveDate > this.todayDt){
            v.expiryDate_min = moment(this.todayDt).add(1, 'days').toDate();
            }
            else{
            v.expiryDate_min = this.todayDt;
            }
          })
          console.log(this.roledata);
          this.ELEMENT_DATA = this.roledata
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.rolelength = this.roledata.length;
        }
        else{
          this.toast.warning(ob.message, ob.code);
        }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }

  //Priyanka start
   validEffectiveDateFlag:boolean = false;
roleDateChange(event, oldValue, effectiveDate, priviarr, modelExp){
        let temp = this.convert(event);
        let today = this.convert(this.todayDt);
        let d1 = new Date(temp).getTime() ;
        let d2 = new Date(oldValue).getTime();
        let d3 = new Date(effectiveDate).getTime();
        this.expiryDateFlag = false;
        this.existingExpDateFlag = false;


        if(priviarr.expiryDate.valid){
          this.expiryDateFlag = true;
          this.existingExpDateFlag = true;
          // this.expBlur();
        }else {
          if(d1 == d2 ){
            // this.expiryDateFlag = true;
            // this.existingExpDateFlag = true;
           //  this.expBlur();
           if(d1 > d3){
            this.expiryDateFlag = true;
            this.existingExpDateFlag = true;
           }
           }
        }
      }

      compareDate(date1, date2){
        let today = this.convert(this.todayDt);
        let d1 = new Date(date1).getTime() ;
        let d2 = new Date(date2).getTime();
        let d3 = new Date(today).getTime();
          if(d1 == d2){
            return 'equall';
           }else if(d1 > d2) {
            return 'greater';
           }else if(d1 < d2){
            return 'smaller';
           }

      }

      roleDateChangeEffectiveDate(event, oldValue, expiryDate, priviarr, modelEff){
        debugger
           let temp = this.convert(event);
           let today = this.convert(this.todayDt);
           let d1 = new Date(temp).getTime() ;
           let d2 = new Date(oldValue).getTime();
           let d3 = new Date(expiryDate).getTime();
           this.effectiveDateFlag = false;
           this.existingEffectiveDateFlag = false;
           this.validEffectiveDateFlag = false;

           if(priviarr.effectiveDate.valid){
            this.existingEffectiveDateFlag = true;
            this.validEffectiveDateFlag = true;

            if(d3 > d1){
              this.existingExpDateFlag = true;
              this.expiryDateFlag = true;
            }else{
              this.expiryDateFlag = false;
            }
            this.effBlur(priviarr);
           }else{
            if(d1 == d2 ){
              // this.effectiveDateFlag = true;
              if(d3 > d1){
                this.existingExpDateFlag = true;
                this.expiryDateFlag = true;
              }
              this.existingEffectiveDateFlag = true;
              // this.expiryDateFlag = true;
              this.effBlur(priviarr);
             }
             else{
             this.existingExpDateFlag = true;
             this.expiryDateFlag = true;
             }
           }

       }

       effBlur(priviarr){
         debugger
          let today = this.convert(this.todayDt);
          let d1 = new Date(priviarr.effectiveDate).getTime() ;
          let d2 = new Date(today).getTime();
          if(d1 >= d2){
          this.model.expiryDate_min = moment(priviarr).add(1, 'days').toDate();
          }else if(d1 < d2){
            priviarr = this.todayDt;
          }
       }

       expBlur(priviarr){
        let d4 = new Date(priviarr.expiryDate).getTime() ;
        let d3 = new Date(priviarr.expiryDateOld).getTime();
        let d1 = new Date(priviarr.effectiveDate).getTime();
         if(d4 == d3 && d1 < d4 ){
          // this.expiryDateFlag = true;
         }else{
          // this.expiryDateFlag = false;
         }
       }



saveRoleChange(whichItem, vall, j) {
    whichItem.saveDateFlg = false;
    var originalPrivilegeBranchData = this.postRoleData.findIndex(object=>(object.roleId === whichItem.roleId));
    var clonedUserRoleIndex = this.clonedUserRoleData.responseData.findIndex(object=>(object.roleId === whichItem.roleId));
    if(!this.effectiveDateFlag || !this.expiryDateFlag){
      var clonedUserRole = Object.assign({},this.clonedUserRoleData.responseData[clonedUserRoleIndex]);
      whichItem.effectiveDate = clonedUserRole.effectiveDate;
      whichItem.expiryDate = clonedUserRole.expiryDate;
      this.effectiveDateFlag = true;
      this.expiryDateFlag = true;
    }
    else{
    if(!whichItem.isNewRole && (whichItem.roleChecked == undefined || whichItem.roleChecked)){
    whichItem['addOrRemoveOrUpdate']="UPDATE";
    if(!whichItem.isNewRole || originalPrivilegeBranchData <0){
    this.postRoleData.push(whichItem);
    }
    }
}
    whichItem.saveIcon=false;
    whichItem.editDate= false;
    this.isEditRoleFlag = true;
  }

  roleEditCheckEvent(data, $event) {
   debugger
    if ($event.checked == false) {
      data["addOrRemoveOrUpdate"] = "Remove";
      data['roleChecked'] = false;
      var originalPrivilegeBranchData = this.postRoleData.findIndex(object=>(object.roleId === data.roleId));
      if(originalPrivilegeBranchData >= 0){
      this.postRoleData[originalPrivilegeBranchData].addOrRemoveOrUpdate = 'REMOVE';
      }else{
      this.postRoleData.push(data);}
    }
    else {
     data['roleChecked'] = true;
      for (var i = this.postRoleData.length - 1; i >= 0; --i) {
        if (this.postRoleData[i].roleName == data.roleName) {
          this.postRoleData.splice(i, 1);
        }
      }
    }
    console.log('this.postRoleData', this.postRoleData);
  }
  removeRoleDetail(vall, j) {
  this.selectedRole ='';
  this.RoleD.responseData.push(vall);
  this.roleEditCheckEvent(vall,false)
    for (var i = this.ELEMENT_DATA.length - 1; i >= 0; --i) {
      if (this.ELEMENT_DATA[i].roleId == vall.roleId) {
        this.ELEMENT_DATA.splice(i, 1);
        this.postRoleData.splice(i,1);
      }
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  removePriviBranchChanged(vall, j) {
  this.existingEffectiveDateFlag = true;
  this.effectiveDateFlag = true;
  this.expiryDateFlag = true;
    for (let i = 0; i < this.testt.length; i++) {
      if (j != null && this.testt[i].branchName == vall) {
        var arr = this.testt[i];
        this.DefaultB.push(arr);
      }
    }
    this.testt.splice(j, 1);
    this.testt.detectChanges();
  }

  checkInRoleArry = (objArray, val) => {
    for (var i = 0; i < objArray.length; i++) {
        if (objArray[i].roleName.toUpperCase() == val.toUpperCase()) {
            return true;
        }
    }
    return false;
  };

  onDefaultBranchChanged(val) {
    this.CurrentDefault = "";
    for (let i = 0; i < this.DefaultB.length; i++) {
      if (this.DefaultB[i].branchCode == val) {
        this.model.data.defaultBranch = this.DefaultB[i].branchCode;
        this.newdata = this.DefaultB[i];
        this.DefaultB.splice(i, 1);
        this.Privillage = this.DefaultB;
      }
    }
  }

  curprivilege;
  onpriviBranchChanged(vall) {

    this.delFlag = true;
    this.selFlag = false;
    for (let i = 0; i < this.DefaultB.length; i++) {
      if (this.DefaultB[i].branchCode == vall) {
        var arr = this.DefaultB[i];
        arr["addOrRemove"] = "add";
        this.priviBranchdata.push(arr);
        this.testt.push(arr);
        this.curprivilege = this.testt.length;
        this.priFilter.branchCode = "";
      }
    }
  }

  DefaultData() {
    var headers = new HttpHeaders({
      branchCode: "1",
      journeyId: "1",
      userId: "1"
    });
    this.httpservice
      .get(window['config'].API_ENDPOINT + "secure/v1/branches/", {
        headers: headers
      })
      .subscribe(data => {
        var dataa = data;
        this.DefaultB = data;
      });
  }


  onPrivichecked(data, $event) {
    if ($event.checked == false) {
      data["addOrRemoveOrUpdate"] = "Remove";
    } else {
      data["addOrRemoveOrUpdate"] = "";
    }
  }


  onRolechecked(data,$event) {
    if ($event.checked == true) {
      data["addOrRemove"] = "Add";
    } else {
      data["addOrRemoveOrUpdate"] = "Remove";
    }
  }






  WCreate;WUpdate;WRead;
  WebPermissionSet(data){

    for (let i = 0; i < data.length; i++) {
      const element = data[i].permission;
      if(element.filter(o =>o.permissionType.startsWith('CREATE')).length >0){
              data[i].WCreate=true;data[i].WUpdate=true;data[i].WRead=true;
            }
      else if(element.filter(o =>o.permissionType.startsWith('UPDATE')).length >0){
        data[i].WUpdate=true;data[i].WRead=true;
      }
      else if(element.filter(o =>o.permissionType.startsWith('READ')).length >0){
        data[i].WRead=true;
      }
      else{
      data[i].WCreate=false;data[i].WUpdate=false;data[i].WRead=false;
      }
    }
  }

  MCreate;MUpdate;MRead;
  MobilePermissionSet(data){

    for (let i = 0; i < data.length; i++) {
     const element = data[i].permission;
           if(element.filter(o =>o.permissionType.startsWith('CREATE')).length >0){
                   data[i].MCreate=true;data[i].MUpdate=true;data[i].MRead=true;
                 }
           else if(element.filter(o =>o.permissionType.startsWith('UPDATE')).length >0){
             data[i].MUpdate=true;data[i].MRead=true;
           }
           else if(element.filter(o =>o.permissionType.startsWith('READ')).length >0){
             data[i].MRead=true;
           }
           else{
            data[i].MCreate=false;data[i].MUpdate=false;data[i].MRead=false;
           }
    }
  }


 roleMaping(){
    this.activeRoleId = '';
  }

  mobileRoledetail = [];
  webRoledetail = [];
  activeRoleId: any;
  webData=[]; mobileData=[];
  getRoledetail(data) {
    let webList = [];
    let MobileList = [];
    this.webData = []
    this.mobileData = []
    this.roleservice.objectIdList(data).subscribe((users: any) => {
      let ob = ErrorConstants.validateException(users);
      // debugger;
      if (ob.isSuccess) {
        if (users.data.responseData[0].objectPermissionList.length == 0) {
          this.toast.warning('Role permissions does not exist for this role', 'Permission not found');
        }
        else {
          users.data.responseData[0].objectPermissionList.forEach(element => {
            if (element.channelId == 33) {
              webList.push(element);
            }
            else {
              MobileList.push(element);
            }
          });
          this.webData = uniqueObj(webList);
          this.mobileData = uniqueObj(MobileList);
          this.WebPermissionSet(this.webData);
          this.MobilePermissionSet(this.mobileData);
          webList = [];
          MobileList = [];
          if(this.activeRoleId == data){
            this.activeRoleId = '';
          }else{
            this.activeRoleId = data;
          }

         // this.expandedElement = index;
        }
      }
      else {
        this.toast.warning(ob.message, ob.code);
      }
    },
      error => {
        this.toast.warning(ErrorConstants.getValue(404));
      });
  }

  removeRoleBranchChanged(vall, j) {
    for (let i = 0; i < this.roledata.length; i++) {
      if (j != null && this.roledata[i].roleName == vall) {
        var arr = this.roledata[i];
      }
    }
    this.roledata.splice(j, 1);
    this.roledata.detectChanges();
  }



}


function uniqueObj(data){
  let p = Object.create(null)
  let  Unq = data.reduce(function (r, o) {
  o.permission={
                  ['CREATE']: {permissionId: Number, permissionType: "CREATE", id: Number, checked: false},
                  ['READ']: {permissionId: Number, permissionType: "READ", id: Number, checked: false},
                  ['UPDATE']: {permissionId: Number, permissionType: "UPDATE", id: Number, checked: false}
                };
        if (!(o.subEntityName in p)) {
            o.permission=[]; p[o.subEntityName] = r.push(o) - 1;
            o.permission.push({permissionId:o.permissionId,permissionType:o.permissionType,id:o.id, checked: true})
            return r;
        }
        else{
            r.forEach(i => {
                if(i.subEntityName==o.subEntityName  && i.permission.length<3){
                    i.permission.push({permissionId:o.permissionId,permissionType:o.permissionType,id:o.id, checked: true});
                }
            });
        }
        return r;
    }, []);
    return Unq;
}
//=========================================================================
//pop up for Default
//=========================================================================
@Component({
  selector: "dialog-data-example-dialog3",
  templateUrl: "advance_search1.html",
  styleUrls: ["../../core.user.css"]
})
export class popforDefaultBranchDetails {
  model: any = {};
  branchWild: any = [];
  model1: any = {};
  DefaultB: any;
  newdata: any = {};
  advanceDefaultName: any;
  advanceDefaultArea: any;
  advanceArea: any;
  twoAPIdata: any;
  pinCodeList : any ={}
  pinCodeDataLength : any;

  branchNameFilter: any = { branchName: "" };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<popforPriviBranchDetails>,private SpinnerService: NgxSpinnerService,
    private httpservice: HttpClient,
    public router: Router,
    private toast: ToastrService,
  ) {}
  ngOnInit() {
    this.model.search='NAME';
  }


  searchBranchFlag: boolean = false;
  advanceFlag() {
    this.searchBranchFlag = true;
  }



  filterByValue(array, string) {
    return array.filter(o => Object.keys(o).some(k => o.branchCode.toLowerCase().includes(string.toLowerCase())));
  }

  arrdata=[];
  branchDataFilter(filterValue: string) {
    debugger

    if(this.tableData.length>=0){
      if(this.arrdata.length==0){
        this.arrdata = [...this.tableData];
       }
       this.tableData = [];
       this.tableData=this.filterByValue(this.arrdata,filterValue);
    }else{
      if(this.arrdata.length==0){
        this.arrdata = [...this.tableData.responseData];
       }
       this.tableData.responseData = [];
       this.tableData.responseData=this.filterByValue(this.arrdata,filterValue);
    }





  }


  //default Branch Advance Search
  showData: any = [];
  tableData: any = [];

  advanceDefaultBranchName(obj) {
    if(obj.length > 2){
    if (this.model.search == "NAME") {
      var headers = new HttpHeaders({
        branchCode: "B1",
        journeyId: "A1",
        userId: "User1"
      });
      let searcgObj=this.model.searchbyname.toUpperCase();
      this.SpinnerService.show();
      this.httpservice
        .get<any>(
          window['config'].API_ENDPOINT +
            `secure/v1/branches/branchName/${searcgObj}`,
          { headers: headers }
        )
        .subscribe(data => {
          let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.twoAPIdata = data.responseData;
          this.tableData = data.data;
                this.tableData.responseData.forEach(element => {
                      if(element.branchType=='REGION'){
                       element.regionBranch=element.branchName;
                      }
                      else if(element.branchType=='CORPORATE'){
                       element.regionBranch='';
                      }
                    });
          this.SpinnerService.hide();
          this.tabledataLength = this.tableData.responseData.length;
          for (let advanceValue of this.twoAPIdata.responseData) {
            this.showData.push(advanceValue);
          }
        }else{
          this.SpinnerService.hide();
          this.toast.warning(ob.message, ob.code);
        }
        });
    } else {
      var headers = new HttpHeaders({
        branchCode: "B1",
        journeyId: "A1",
        userId: "User1"
      });
      this.SpinnerService.hide();
      this.httpservice
        .get(
          window['config'].API_ENDPOINT +
            `secure/v1/branches/branchtype/${this.model.search}`,
          { headers: headers }
        )
        .subscribe(data => {
          this.advanceArea = data;
          this.tableData = this.advanceArea.data;
          this.SpinnerService.hide();
          this.tableData.data.forEach(element => {
            if(element.branchType=='REGION'){
             element.regionBranch=element.branchName;
            }
            else if(element.branchType=='CORPORATE'){
             element.regionBranch='';
            }
          });

        });
    }
  }
}
  areaDataByName;
  advanceDefaultBranchArea() {
   debugger
   this.tableData.responseData=[];
   this.tableData=[];
   this.arrdata=[];
   this.areaDataByName =[];
   let apiEndPoint ='';
// debugger
       if (this.model.search != "NAME") {
       if(this.model.search == "TYPE"){
       apiEndPoint = window['config'].API_ENDPOINT +`secure/v1/branches/types`
       }
       else if(this.model.search != "PINCODE"){
       apiEndPoint = window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/${this.model.search}`;
       }
         var headers = new HttpHeaders({
           branchCode: "B1",
           journeyId: "A1",
           userId: "User1"
         });
         this.SpinnerService.show();
         this.httpservice
           .get<any>(
             apiEndPoint,
             { headers: headers }
           )
           .subscribe(data => {
            let ob = ErrorConstants.validateException(data);
           if(ob.isSuccess){
             this.areaDataByName = data.data;
             this.SpinnerService.hide();
             }
           else{
             this.toast.warning(ob.message, ob.code);
             this.SpinnerService.hide();
             }
           },error=>{
            this.SpinnerService.hide();
          });
       }
     }

  tabledataLength;
  advanceDefaultBranchAreaById(data) {
        var headers = new HttpHeaders({
          branchCode: "B1",
          journeyId: "A1",
          userId: "User1"
        });
        this.SpinnerService.show();
        this.httpservice
          .get<any>(
           window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByArea.branchId,
            { headers: headers }
          )
          .subscribe(data => {
          let ob = ErrorConstants.validateException(data);
          if(ob.isSuccess){
            this.tableData = data.data;
            this.SpinnerService.hide();
            this.tabledataLength = this.tableData.responseData.length;
            }
             else{
                   this.tableData=[];
                      this.toast.warning(ob.message, ob.code);
                      this.SpinnerService.hide();
                    }
                    },
                          Error => {
                            this.SpinnerService.hide();
                           console.log('Error');
          });
      }

  finalAreaData = [];
  checkedFinalId: any;
  filterDataByAreaList(data) {
    this.SpinnerService.show();
    this.finalAreaData.push(data);
    this.checkedFinalId = data.branchId;
    this.SpinnerService.hide();
  }

  advanceDefaultBranchRegionById(data) {
    var headers = new HttpHeaders({
      branchCode: "B1",
      journeyId: "A1",
      userId: "User1"
    });
    this.SpinnerService.show();
    this.httpservice
      .get<any>(
        window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByRegion.branchId,
        { headers: headers }
      )
      .subscribe(data => {
      let ob = ErrorConstants.validateException(data);
      if(ob.isSuccess){
        this.tableData = data.data;
        this.SpinnerService.hide();
        this.tabledataLength = this.tableData.responseData.length;
        }
         else{
               this.tableData=[];
                  this.toast.warning(ob.message, ob.code);
                  this.SpinnerService.hide();
                }
                },
                      Error => {
                       console.log('Error');
      });
  }

  advanceDefaultBranchTypeById(data) {
  debugger
 var headers = new HttpHeaders({
      branchCode: "B1",
      journeyId: "A1",
      userId: "User1"
    });
    this.SpinnerService.show();
    this.httpservice
      .get<any>(
        window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/` + this.model.searchByType,
        { headers: headers }
      )
      .subscribe(data => {
      let ob = ErrorConstants.validateException(data);
       if(ob.isSuccess){
       this.tableData = data.data;
        this.SpinnerService.hide();
        this.tabledataLength = this.tableData.responseData.length;
        }
         else{
        this.tableData=[];
        this.toast.warning(ob.message, ob.code);
        this.SpinnerService.hide();
             }
        },
        Error => {
        console.log('Error');
      });
  }

  // pincode
  advanceDefaultBranchPincode() {
    if(this.model.searchbypincode && this.model.searchbypincode.length >= 3){
        var headers = new HttpHeaders({
          branchCode: "B1",
          journeyId: "A1",
          userId: "User1"
        });
        this.SpinnerService.show();
        this.httpservice
          .get<any>(
            window['config'].API_ENDPOINT +
              `secure/v1/branches/pincodeList/${this.model.searchbypincode}`,
            { headers: headers }
          )
          .subscribe(data => {
          let ob = ErrorConstants.validateException(data);
            if(ob.isSuccess){
            this.pinCodeList = data.data;
            this.SpinnerService.hide();
            this.pinCodeDataLength = this.pinCodeList.responseData.length;
            if(this.pinCodeDataLength ==0){
              this.toast.warning(ErrorConstants.branchNotFoundErrorMessage + this.model.searchbypincode +
              ErrorConstants.branchNotFoundErrorMessage1, ErrorConstants.businessErrorNotFoundErrorCode);
              this.advancepincode = false;
              }else {
                this.advancepincode = true;
              }
            }
            else{
            this.toast.warning(ob.message, ob.code);
            this.advancepincode = false;
            this.SpinnerService.hide();
            }
               },
             Error => {
             this.SpinnerService.hide();
             console.log('Error');
           });
           }
           else{
           this.toast.warning(ErrorConstants.minCharacterSearchErrorMessage, '');
           }
      }


  advanceDefaultBranchPincodeByPincode() {

   var headers = new HttpHeaders({
            branchCode: "B1",
            journeyId: "A1",
            userId: "User1"
          });
          this.SpinnerService.show();
          this.httpservice
            .get<any>(
              window['config'].API_ENDPOINT +
                `secure/v1/branches/pincode/${this.model.apincode.pincode}`,
              { headers: headers }
            )
            .subscribe(data => {
              let ob = ErrorConstants.validateException(data);
              if (ob.isSuccess) {
                this.tableData = data.data;
                this.tabledataLength = this.tableData.responseData.length;
                this.SpinnerService.hide();
                if(this.tabledataLength ==0){
                     this.tableData=[];
                     this.toast.warning('Branches for ' + this.model.apincode.pincode +' pincode are not active in propel-i', 'RECORD_NOT_FOUND');
                     }
                     else{
                  this.tableData.responseData.forEach(element => {
                         if(element.branchType=='REGION'){
                          element.regionBranch=element.branchName;
                         }
                         else if(element.branchType=='CORPORATE'){
                          element.regionBranch='';
                         }
                       });
                     }
              } else {
                this.tableData = [];
                this.SpinnerService.hide();
                this.toast.warning(ob.message, ob.code);
                this.advancepincode = false;
              }
              },
             Error => {
             this.SpinnerService.hide();
             console.log('Error');
           });
        }

  advancepincode: boolean = false;
  pincode() {
    this.advancepincode = true;
  }
  // end of pincode

  allocateAreaData() {
    debugger
    let defaultBranch = this.finalAreaData;
    let SearchTypeDefault=this.model.search;
    this.dialogRef.close({ defaultBranch,SearchTypeDefault });
  }

  //default Branch Advance for Area Region
  //dropdown list for advance Default Branch Name
  advance: any = [];
  advanceSearchList: any = [
    { value: "NAME" },
    { value: "AREA", criteriaValue: "branchtype" },
    { value: "REGION", criteriaValue: "branchtype" },
    { value: "TYPE", criteriaValue: "PINCODE" },
    { value: "PINCODE", criteriaValue: "branchtype" }
  ];
  onChangeValue(val) {
    this.model.search;
  }

  //for input box change
  nameSearchInbox: boolean = false;
  inputFlag(val) {
    if (this.model.serach == "NAME") {
      this.nameSearchInbox = true;
    }
  }

  onChangeValueforBranch() {

    this.branchWild;
  }
  filterEntity() {

    let userBranch: any;
    let defaultBranch: any = [];
    defaultBranch = this.twoAPIdata.data;
    userBranch = this.branchWild;
    this.dialogRef.close({ defaultBranch });
  }

  filterByArea(data) {

    for (let advaneAreaFilter of this.advanceArea) {
      if (advaneAreaFilter == this.model.area) {
        this.tableData.push(advaneAreaFilter);
      }
    }
  }

  filterByType(data) {

    for (let advanceTypeFilter of this.advanceArea) {
      if (advanceTypeFilter == this.model.area) {
        this.tableData.push(advanceTypeFilter);
      }
    }
  }

  filterBy;

  closeDialog(): void {
    this.dialogRef.close();
  }


}

//===========================================================================
//pop for privillage branch
//===========================================================================
@Component({
  selector: "dialog-data-example-dialog-privi3",
  templateUrl: "advance_search_privi1.html",
  styleUrls: ["../../core.user.css"]
})
export class popforPriviBranchDetails  {
  model: any = {};
  branchWild: any = [];
  model1: any = {};
  DefaultB: any;
  newdata: any = {};
  advanceDefaultName: any;
  advanceDefaultArea: any;
  advanceArea: any;
  twoAPIdata: any;
  IsEffDate:Date;
  IsExpdate:Date;
  IsEffDateForvalidation:Date;
  IsExpdateForvalidation:Date;
  pinCodeList : any ={}
  pinCodeDataLength : any;
  expiryDateMaxValidation:Date;
  today;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<popforPriviBranchDetails>,
    private httpservice: HttpClient,
    public router: Router,
    private toast: ToastrService,
    private SpinnerService: NgxSpinnerService,
    private authService:AuthorizationService
  ) {
    this.authService.getTimeStamp().subscribe( date => {
      this.today = new Date(date.data.responseData.split("[")[0])
      if(this.today){
        this.IsEffDateForvalidation = this.today;
        this.minDateEffe = this.today
      }else{
        this.IsEffDateForvalidation = new Date();
        this.minDateEffe = new Date()
      }
    })
  }

  ngOnInit() {
    this.model.search='NAME';
  }


  searchBranchFlag: boolean = false;
  advanceFlag() {
    this.searchBranchFlag = true;
  }


 selectAll($event) {
  if($event.checked==true){
   this.tableData.forEach(element => {
    this.filterDataByAreaList($event,element);
    element.checked = !element.checked;
    });
  }
  else if($event.checked==false){
    this.tableData.forEach(element => {
      element.checked = false;
      this.finalAreaData.splice(element,1);
    });
  }

}




//hide submit button if date is invalid range
flgSubmitBtn:boolean = true //show
minDateEffe;
EffectiveDateEvent(change, $event){
  if(this.IsEffDate){
     if(this.IsEffDate.getFullYear() > 9999){
         this.flgSubmitBtn = false;
         this.IsExpdateForvalidation = new Date(this.convert('01/01/9999'));
         this.IsEffDateForvalidation = moment(this.today).add(1, 'days').toDate();
         }
         else{
      this.IsEffDateForvalidation = moment(this.IsEffDate).add(1, 'days').toDate();
      }
    }else{
      this.IsEffDateForvalidation = moment(this.today).add(1, 'days').toDate();
    }
    this.validateDt(change);
}


ExpiryDateEvent(change, $event){
   if(this.IsExpdate.getFullYear() > 9999){
         this.flgSubmitBtn = false;
         this.expiryDateMaxValidation = new Date(this.convert('01/01/9999'));
         this.IsExpdateForvalidation =  moment(this.IsExpdate).subtract(1, 'days').toDate();
         }
         else{
    this.IsExpdateForvalidation =  moment(this.IsExpdate).subtract(1, 'days').toDate();
    }
    this.validateDt(change);
}

validateDt($event){
  // debugger
  if(
    !this.IsExpdate &&  moment(this.IsEffDate).isAfter(new Date()))
  {
    this.flgSubmitBtn = true
  }else if(
      moment(this.IsEffDate).isBefore(this.IsExpdate) &&
      moment(new Date(this.IsEffDate).setHours(0,0,0,0)).isSameOrAfter(this.today.setHours(0,0,0,0))
    ){
      // debugger
      this.flgSubmitBtn = true // show
    }else{
      this.flgSubmitBtn = false // hide
    }

    // min max effective date change
    if(moment(new Date(this.IsEffDate).setHours(0,0,0,0)).isSameOrBefore(this.today.setHours(0,0,0,0))){
        this.minDateEffe = this.today;
    }

    if(moment(new Date(this.IsExpdate).setHours(0,0,0,0)).isSameOrBefore(this.today.setHours(0,0,0,0))){
      this.minDateEffe = this.today;
      this.IsExpdateForvalidation = moment(this.today).add(1000, 'days').toDate()
    }

}
filterByValue(array, string) {
  return array.filter(o => Object.keys(o).some(k => o.branchCode.toLowerCase().includes(string.toLowerCase())));
}

arr=[];
branchDataFilter(filterValue: string) {
  // debugger

    if(this.tableData.length>=0){
      if(this.arr.length==0){
        this.arr = [...this.tableData];
       }
       this.tableData = [];
       this.tableData=this.filterByValue(this.arr,filterValue);
    }else{
      if(this.arr.length==0){
        this.arr = [...this.tableData.responseData];
       }
       this.tableData.responseData = [];
       this.tableData.responseData=this.filterByValue(this.arr,filterValue);
    }
}





  showData: any = [];
  tableData: any = [];
   advanceDefaultBranchName(obj){
     if(obj.length > 2){
     if(this.model.search=="NAME"){
       let searcgObjJ=this.model.searchbyname.toUpperCase();
       this.SpinnerService.show();
      var headers = new HttpHeaders({'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
     this.httpservice.get(window['config'].API_ENDPOINT+`secure/v1/branches/branchName/${searcgObjJ}`,  ).subscribe(
       data => {
         let ob = ErrorConstants.validateException(data);
           if(ob.isSuccess){
             this.tableData=[];
             this.twoAPIdata=data;
             this.SpinnerService.hide();
             console.log(this.newdata.previlegeBranches);
             for (let i = 0; i < this.twoAPIdata.data.responseData.length; i++) {
               const element = this.twoAPIdata.data.responseData[i];
               if(element.branchCode==AppSetting.defaultBranchcode){
                 console.log('This is Default')
               }
               else{
                   element.effective_date='';
                   element.expiryDate='';
                    if(element.branchType=='REGION'){
                     element.regionBranch=element.branchName;
                    }
                    else if(element.branchType=='CORPORATE'){
                     element.regionBranch='';
                     }
                   this.tableData.push(element);
                   this.tabledataLength=this.tableData.length;
                   this.showData.push(element);
               }
             }
           }
           else{
             this.toast.warning(ob.message,ob.code);
             this.SpinnerService.hide();
           }
       },
       error=>{
         this.toast.warning(ErrorConstants.getValue(404));
       });
     }

       else{

         var headers = new HttpHeaders({'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
         this.httpservice.get(window['config'].API_ENDPOINT+`secure/v1/branches/branchtype/${this.model.search}`,  ).subscribe(
           data => {
             this.advanceArea=data;
             this.tableData=this.advanceArea.data
             console.log(this.advanceArea, "Hello two ELSE API DATA");
           });
       }
      }
   }


  areaDataByName;
  advanceDefaultBranchArea() {
//  debugger
    this.tableData=[];
    this.tableData.responseData=[];
   this.arr=[];
   this.areaDataByName =[];
   let apiEndPoint ='';

       if (this.model.search != "NAME") {
       if(this.model.search == "TYPE"){
       apiEndPoint = window['config'].API_ENDPOINT +`secure/v1/branches/types`
       }
       else if(this.model.search != "PINCODE"){
       apiEndPoint = window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/${this.model.search}`;
       }
         var headers = new HttpHeaders({
           branchCode: "B1",
           journeyId: "A1",
           userId: "User1"
         });
         this.SpinnerService.show();
         this.httpservice
           .get<any>(
             apiEndPoint,
             { headers: headers }
           )
           .subscribe(data => {
            let ob = ErrorConstants.validateException(data);
                                if(ob.isSuccess){
             this.areaDataByName = data.data;
             this.SpinnerService.hide();
             }
              else{
              this.toast.warning(ob.message, ob.code);
              this.SpinnerService.hide();
                          }
           },
           error=>{
            this.SpinnerService.hide();
          }
           );
       }
     }


  tabledataLength;
  advanceDefaultBranchAreaById(data) {
            var headers = new HttpHeaders({
              branchCode: "B1",
              journeyId: "A1",
              userId: "User1"
            });
            this.SpinnerService.show();
            this.httpservice
              .get<any>(
                window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByArea.branchId,
                { headers: headers }
              )
              .subscribe(data => {
              let ob = ErrorConstants.validateException(data);
              if(ob.isSuccess){
                let tempData = data.data.responseData;
                 for (let i = 0; i < tempData.length; i++) {
                   const element = tempData[i];
                   if(element.branchCode==AppSetting.defaultBranchcode){
                     console.log(this.finalAreaData +' and '+ this);
                     console.log('This is Default');
                     this.tabledataLength= data.data.responseData.length;
                   }
                   else{
                       element.effective_date='';
                       element.expiryDate='';
                       this.tableData['responseData'].push(element);
                       this.tabledataLength=this.tableData['responseData'].length;
                       //this.showData.push(element);
                   }
                 }
                 this.SpinnerService.hide();
                }
                 else{
                       this.tableData=[];
                          this.toast.warning(ob.message, ob.code);
                          this.SpinnerService.hide();
                        }
                        },
                              Error => {
                               console.log('Error');
              });
          }
  finalAreaData = [];
  filterDataByAreaList($event,data) {
    if($event.checked==true){
      this.finalAreaData.push(data);
    }
    else{
      this.finalAreaData.forEach((element,i)=>{
        if(element.branchCode==data.branchCode){
          this.finalAreaData.splice(i,1);
          return
        }
      })
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  advanceDefaultBranchRegionById(data) {

       var headers = new HttpHeaders({
         branchCode: "B1",
         journeyId: "A1",
         userId: "User1"
       });
       this.SpinnerService.show();
       this.httpservice
         .get<any>(
           window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByRegion.branchId,
           { headers: headers }
         )
         .subscribe(data => {
         let ob = ErrorConstants.validateException(data);
         if(ob.isSuccess){
           let tempData = data.data.responseData;
                                   for (let i = 0; i < tempData.length; i++) {
                                     const element = tempData[i];
                                     if(element.branchCode==AppSetting.defaultBranchcode){
                                       console.log(this.finalAreaData +' and '+ this);
                                       console.log('This is Default');
                                       this.tabledataLength= data.data.responseData.length;
                                     }
                                     else{
                                         element.effective_date='';
                                         element.expiryDate='';
                                         this.tableData['responseData'].push(element);
                                         this.tabledataLength=this.tableData['responseData'].length;
                                         //this.showData.push(element);
                                     }
                                   }
                                   this.SpinnerService.hide();
           }
            else{
                  this.tableData=[];
                     this.toast.warning(ob.message, ob.code);
                     this.SpinnerService.hide();
                   }
                   },
                         Error => {
                          console.log('Error');
                          this.SpinnerService.hide();
         });
     }


  advanceDefaultBranchTypeById(data) {
debugger
     var headers = new HttpHeaders({
          branchCode: "B1",
          journeyId: "A1",
          userId: "User1"
        });
        this.SpinnerService.show();
        this.httpservice
          .get<any>(
            window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/` + this.model.searchByType,
            { headers: headers }
          )
          .subscribe(data => {
          let ob = ErrorConstants.validateException(data);
           if(ob.isSuccess){
            let tempData = data.data.responseData;
                        for (let i = 0; i < tempData.length; i++) {
                          const element = tempData[i];
                          if(element.branchCode==AppSetting.defaultBranchcode){
                            console.log(this.finalAreaData +' and '+ this);
                            console.log('This is Default');
                            this.tabledataLength= data.data.responseData.length;
                          }
                          else{
                              element.effective_date='';
                              element.expiryDate='';
                              this.tableData['responseData'].push(element);
                              this.tabledataLength=this.tableData['responseData'].length;
                              this.showData.push(element);
                          }
                        }
                        this.SpinnerService.hide();
            }
             else{
            this.tableData=[];
            this.toast.warning(ob.message, ob.code);
            this.SpinnerService.hide();
                 }
            },
            Error => {
            console.log('Error');
            this.SpinnerService.hide();
          });
      }


  // pincode
  advanceDefaultBranchPincode() {
  if(this.model.searchbypincode && this.model.searchbypincode.length >= 3){
    var headers = new HttpHeaders({
      branchCode: "B1",
      journeyId: "A1",
      userId: "User1"
    });
    this.SpinnerService.show();
    this.httpservice
      .get<any>(
        window['config'].API_ENDPOINT +
          `secure/v1/branches/pincodeList/${this.model.searchbypincode}`,
        { headers: headers }
      )
      .subscribe(data => {
      let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
            this.pinCodeList = data.data;
            this.SpinnerService.hide();
            this.pinCodeDataLength = this.pinCodeList.responseData.length;
            if(this.pinCodeDataLength ==0){
            this.toast.warning(ErrorConstants.branchNotFoundErrorMessage + this.model.searchbypincode +
                          ErrorConstants.branchNotFoundErrorMessage1, ErrorConstants.businessErrorNotFoundErrorCode);
            this.advancepincode = false;
            }else {
              this.advancepincode = true;

            }
        }
         else{
            this.toast.warning(ob.message, ob.code);
            this.SpinnerService.hide();
            this.advancepincode = false;
             }
            },
            Error => {
            console.log('Error');
            this.SpinnerService.hide();
          });
          }
          else{
          this.toast.warning(ErrorConstants.minCharacterSearchErrorMessage, '');
          }
  }

  advanceDefaultBranchPincodeByPincode() {

   var headers = new HttpHeaders({
         branchCode: "B1",
         journeyId: "A1",
         userId: "User1"
       });
       this.SpinnerService.show();
       this.httpservice
         .get<any>(
           window['config'].API_ENDPOINT +
             `secure/v1/branches/pincode/${this.model.apincode.pincode}`,
           { headers: headers }
         )
         .subscribe(data => {
          let ob = ErrorConstants.validateException(data);
          if (ob.isSuccess) {
            let tempData = data.data.responseData;
            for (let i = 0; i < tempData.length; i++) {
              const element = tempData[i];
              if(element.branchCode==AppSetting.defaultBranchcode){
                console.log(this.finalAreaData +' and '+ this);
                console.log('This is Default');
              }
              else{
                  element.effective_date='';
                  element.expiryDate='';
                  if(element.branchType=='REGION'){
                   element.regionBranch=element.branchName;
                  }
                  else if(element.branchType=='CORPORATE'){
                   element.regionBranch='';
                  }
                  this.tableData['responseData'].push(element);
                  this.tabledataLength=this.tableData['responseData'].length;
                  this.showData.push(element);
              }
            }
            this.advancepincode = true;
            this.SpinnerService.hide();
            this.pinCodeDataLength  = this.tabledataLength;
             if(this.pinCodeDataLength == 0){
                this.toast.warning('Branches for ' + this.model.apincode.pincode +' pincode are not active in propel-i', 'RECORD_NOT_FOUND');
                this.advancepincode = false;
                this.tableData = [];
                }
          } else {
            this.tableData = [];
            this.toast.warning(ob.message, ob.code);
            this.advancepincode = false;
          }

          this.SpinnerService.hide();
         });
     }
  advancepincode: boolean = false;
  pincode() {
    this.advancepincode = true;
  }
  // end of pincode

  allocateAreaData() {
  this.finalAreaData['isNewBranch']=true;
    let defaultBranch = this.finalAreaData;
    let SearchTypeDefault =this.model.search;

    if(this.IsEffDate && this.IsExpdate){
      // this.IsEffDate= new Date(this.IsEffDate.setDate(this.IsEffDate.getDate() - 1));
      // this.IsExpdate = new Date(this.IsExpdate.setDate(this.IsExpdate.getDate() + 1));
      this.finalAreaData.forEach(element => {
      element.effectiveDate=this.convert(this.IsEffDate);
      element.expiryDate=this.convert(this.IsExpdate);
    });
    }
    else{
      this.finalAreaData.forEach(element => {
        // debugger
        if(this.IsEffDate){
          element.effectiveDate   =    new Date(this.IsEffDate)
        }else{
          element.effectiveDate   =    new Date(this.today)
        }
        if(this.IsExpdate){
                  element.expiryDate   =    new Date(this.IsExpdate)
                  }
                  else{
                  element.expiryDate      =    moment(element.effectiveDate).add(10, 'years').toDate()
                  }
      });
    }

    this.dialogRef.close({ defaultBranch,SearchTypeDefault  });
  }

  //default Branch Advance for Area Region
  //dropdown list for advance Default Branch Name
  advance: any = [];
  advanceSearchList: any = [
    { value: "NAME" },
    { value: "AREA", criteriaValue: "branchtype" },
    { value: "REGION", criteriaValue: "branchtype" },
    { value: "TYPE", criteriaValue: "PINCODE" },
    { value: "PINCODE", criteriaValue: "branchtype" }
  ];
  onChangeValue(val) {
    this.model.search;
  }

  //for input box change
  nameSearchInbox: boolean = false;
  inputFlag(val) {
    if (this.model.serach == "NAME") {
      this.nameSearchInbox = true;
    }
  }

  onChangeValueforBranch() {

    this.branchWild;
  }
  filterEntity() {

    let userBranch: any;
    let defaultBranch: any = [];
    defaultBranch = this.twoAPIdata.data;
    userBranch = this.branchWild;
    this.dialogRef.close({ defaultBranch });
  }

  filterByArea(data) {

    for (let advaneAreaFilter of this.advanceArea) {
      if (advaneAreaFilter == this.model.area) {
        this.tableData.push(advaneAreaFilter);
      }
    }
  }

  filterByType(data) {

    for (let advanceTypeFilter of this.advanceArea) {
      if (advanceTypeFilter == this.model.area) {
        this.tableData.push(advanceTypeFilter);
      }
    }
  }

  filterBy;
  closeDialog(): void {
    this.dialogRef.close();
  }



  advanceDefaultBranchByAreaBranchId() {
      let apiEndPoint ='';
      if(this.model.search == "AREA"){
      apiEndPoint = window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByArea.branchId
      }
      else{
      window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByRegion.branchId
      }
        var headers = new HttpHeaders({
          branchCode: "B1",
          journeyId: "A1",
          userId: "User1"
        });
        this.httpservice
          .get<any>(
            window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.searchByArea.branchId,
            { headers: headers }
          )
          .subscribe(data => {
          let ob = ErrorConstants.validateException(data);
          if(ob.isSuccess){
            this.tableData = data.data;
            this.tabledataLength = this.tableData.responseData.length;
            }
             else{
                   this.tableData=[];
                      this.toast.warning(ob.message, ob.code);
                    }
                    },
                          Error => {
                           console.log('Error');
          });
      }
}
