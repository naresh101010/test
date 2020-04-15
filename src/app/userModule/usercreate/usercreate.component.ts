import { Component, OnInit,Inject, HostListener } from '@angular/core';
import {FormGroup, FormBuilder,  Validators } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import{ UsercreateService } from './usercreate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from "../../app.setting";
import {ChangeDetectorRef} from '@angular/core';
import { RolecreateService } from './../role/rolecreate.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { filter } from 'rxjs-compat/operator/filter';
import { error } from 'util';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
//for pop up
export interface DialogData {}
export interface PeriodicElement {roleId: number,roleName: string,status: number,addOrRemoveOrUpdate:string,
  description:string}

@Component({
  selector: 'app-usercreate',
  templateUrl: './usercreate.component.html',
  styleUrls: ['../../core.user.css'],
  animations: [trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class UsercreateComponent implements OnInit {

  //  Menu list
  DepartmentHierarchyMenu:any ;
  //mobile number validation
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {return false;}
    return true;
  }

  textlimit50(){
     this.isUserIdHasValue = true;
    if(this.newdata.userId.length>50){
      return false;
    }
    return true;
  }
  //end

  emailPattern: boolean;
  emailValidation(){
  this.isEmailHasValue =true;
    this.emailPattern= true;
    let  regexp = new RegExp(/^[A-Za-z_0-9.]{2,}@([A-Za-z0-9]{1,}[.]{1}[A-Za-z]{2,6}|[A-Za-z0-9]{1,}[.][A-Za-z]{2,6}[.]{1}[A-Za-z]{2,6})$/);
    let pattern = regexp.test(this.newdata.email.trim());
    if(!pattern){
      this.emailPattern= true;
    }
    else{
      this.emailPattern = false;
    }
  }


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

  ELEMENT_DATA = [];
  //mat-table
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  columnsToDisplay = [ 'roleName', 'effectiveDate','expiryDate', 'editOperation', 'status','delete'];
  columnsToDisplay2 = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay3 = ['name', 'weight', 'symbol', 'position'];
  expandedElement: PeriodicElement | null;
  //mat-table end
  effective_date = Date.now();


 priviFlag:boolean=false;
 indexval
 priviEffect(data){
  for (let i = 0; i < this.newdata.previlegeBranches.length; i++) {
     const element = this.newdata.previlegeBranches[i];
          element.effectiveDate=this.convert(this.newdata.previlegeBranches[i].effectiveDate);
          if(this.newdata.previlegeBranches[i].expiryDate == null || this.newdata.previlegeBranches[i].expiryDate <= this.newdata.previlegeBranches[i].effectiveDate ){
          element.expiryDate = moment(this.newdata.previlegeBranches[i].effectiveDate).add(10, 'years').toDate();
          }else{
          element.expiryDate=this.convert(this.newdata.previlegeBranches[i].expiryDate);}
          if(element.expiryDate=='NaN-aN-aN'){
           element.expiryDate='Null';
          }
     }
 this.expiryDateFlag= false;
     this.effectiveDateFlag= true;
     this.priviFlag=true;
    this.indexval=data
 }

 roleFlag:boolean=false;
 roleEffect(){
    this.roleFlag=true;
 }

status:any=[
  {lookup:"Active", value:1},
  {lookup:"Inactive", value:0}
];
//end of status



username:string= "User Name";
public userm = [];
userBranch:any;
userPrivi:any;
defaultBranch:any=[]
priviBranchData:any=[]
DefaultB:any;
Privillage:any;
RoleD:any;
CatData:any={};
userCreate:any = {};
advanceDefaultFilter:any;
advancePriViFilter:any;
isAdminFlag:any;
todayDt;
IsEffDate:Date;
IsExpdate:Date;
IsEffDateForvalidation:Date;
IsExpdateForvalidation:Date;
today;

constructor(private roleservice:RolecreateService, private SpinnerService: NgxSpinnerService,
   private changeDetectorRef: ChangeDetectorRef,
   public usercreateservice:UsercreateService,
   private httpservice:HttpClient,
   private toast: ToastrService,
    public router:Router,
    public dialog: MatDialog,
    private authService:AuthorizationService  ) {
    this.authService.getTimeStamp().subscribe(date=>{
      this.todayDt = new Date(date.data.responseData.split("[")[0]);
    })
     }

//toaster message
// pup up for Default branch
isMobileHasValue : boolean =true;
isUserIdHasValue : boolean =true;
isUserNameHasValue : boolean =true;
isEmailHasValue : boolean = true;
deftData:any

validateUserDetails(){
 this.newdata.userId.length <=0 ?this.isUserIdHasValue =false : this.isUserIdHasValue =true;
      this.newdata.name.length <=0 ?this.isUserNameHasValue =false : this.isUserNameHasValue =true;
      this.newdata.mobile.length <=0 ?this.isMobileHasValue =false : this.isMobileHasValue =true;
      this.newdata.email.length <=0 ?this.isEmailHasValue =false : this.isEmailHasValue =true;
}
openDialog() {
  const dialogRef = this.dialog.open(popforDefaultBranch, {disableClose: true,
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result != undefined && this.checkInPriviArryP(this.newdata.previlegeBranches,result.defaultBranch[0])==true){
      this.toast.warning(`${result.defaultBranch[result.defaultBranch.length - 1].branchCode} is already set as privilege branch...First you need to remove it from the privilege branch list`);
    }
    if(result != undefined && this.checkInPriviArryP(this.newdata.previlegeBranches,result.defaultBranch[0])==false){
      AppSetting.defaultBranchcode=result.defaultBranch[0].branchCode;
      this.SearchTypeDefault= result.searchTypedata;
      this.userBranch = result.defaultBranch[result.defaultBranch.length - 1].branchCode;
      this.newdata.defaultBranch=result.defaultBranch[0];
      this.deftData=this.newdata.defaultBranch
      this.newdata.defaultBranch.addOrRemoveOrUpdate='Add';
      this.userFilter.branchCode=result.defaultBranch[result.defaultBranch.length -1 ].branchName
    }

  });
}

checkInPriviArryP = (objArray, val) => {
  for (var i = 0; i < objArray.length; i++) {
      if (objArray[i].branchCode.toUpperCase() == val.branchCode.toUpperCase()) {
          return true;
      }
  }
  return false;
};

  expiryDateFlag:boolean = false;
  effectiveDateFlag:boolean = true;
  isEditRoleFlag:boolean = true;
  expiryDateErrorMessage: String;
  effectiveDateErrorMessage: String;

  dateChange(event, oldValue, effectiveDate,j, priviarr){
    this.expiryDateErrorMessage='';
    let temp = this.convert(event);
     let d1 = moment(new Date(event),"dd/MM/yyyy");
     let d4 = moment(new Date(temp),"dd/MM/yyyy") ;
     let d2 = moment(new Date(oldValue),"dd/MM/yyyy") ;
     let d3 = moment(new Date(effectiveDate),"dd/MM/yyyy") ;
     let d5 = moment(null,"dd/MM/yyyy");
     priviarr['newExpiryDate'] = event;
     if(d1.year() >9999){

         priviarr.expiryDate_max = new Date(this.convert('01/01/9999'));
         this.expiryDateFlag = true
         this.expiryDateErrorMessage ='Invalid calender range';
     }else{
      if((d1.isSameOrAfter( d2, 'day')) || (d1.isAfter(d3,'day')) || (d1.isBefore(d3,'day'))) {
      if(d1.isSame(d3, 'day')){
      this.expiryDateFlag = true;
      this.expiryDateErrorMessage ='Exp./Eff. date should not be equal';
      }
      else if(d1.isBefore(d3,'day')){
      this.expiryDateFlag = true;
      if(event ==null){
      this.expiryDateErrorMessage ='Invalid date';
      }
      else{
      this.expiryDateErrorMessage ='Should be greater than Eff. date';
      }
              }
        }
        else if( d1.isBefore(d3,'day')){
        this.expiryDateErrorMessage ='Expiry date should not be past dated';
        priviarr.expiryDate = event;
        this.expiryDateFlag = false;
        }

        else if(d1.isSame(d3,'day')){
        this.expiryDateFlag = true;
        this.expiryDateErrorMessage ='Exp./Eff. date should not be equal';
        }
        else{
        this.expiryDateErrorMessage ='invalid date range';
        this.expiryDateFlag = true;
        }
        priviarr.expiryDate = event;

  }
    }

  dateChangeEffectiveDate(event, oldValue, expiryDate,j, priviarr){
    this.effectiveDateErrorMessage ='';
    let temp = this.convert(event);
    let today = this.convert(this.todayDt);
    let d1 = moment(new Date(temp),"dd/MM/yyyy") ;
    let d2 = moment(new Date(oldValue),"dd/MM/yyyy") ;
    let d3 =  moment(new Date(expiryDate),"dd/MM/yyyy") ;
    let d4 =  moment( new Date(today),"dd/MM/yyyy") ;
    let d5 =  moment( new Date(priviarr.effectiveDate),"dd/MM/yyyy") ;
    priviarr['newEffectiveDate'] = event;
    this.expiryDateFlag = false;
    this.effectiveDateFlag = false;
    this.effectiveDateErrorMessage ='Effective date cannot be past dated';
    if(event == null || d1.year() >9999){
    if(event==null){
    priviarr.effectiveDate_max = new Date(this.convert('01/01/9999'));
    this.effectiveDateErrorMessage ='Effective date is mandatory';
    }else{
         priviarr.effectiveDate_max = new Date(this.convert('01/01/9999'));
         this.effectiveDateErrorMessage ='Invalid calender range';
         }
         }else{
     if((d1 == d2) || (d1 >= d4)){
      priviarr.effectiveDate = temp;
      if( new Date(priviarr.effectiveDate) >= new Date(today)){
        priviarr.effectiveDate_min = new Date(today);
        this.effectiveDateFlag = true;
      }

     this.effectiveDateFlag = true;
     this.expiryDateFlag = false;
     let tomorrow = moment(priviarr.effectiveDate).add(1, 'days').toDate();
     priviarr.expiryDate_min = new Date(this.convert(tomorrow));
      if(new Date(priviarr.expiryDate) <= new Date(tomorrow)){
       this.expiryDateErrorMessage ='Exp date should be greater than Eff date';
        this.expiryDateFlag = true;
        priviarr.expiryDate_min = new Date(this.convert(tomorrow));
        priviarr.expiryDate = moment(priviarr.effectiveDate).add(10, 'years').toDate();
      }
      else if((new Date(priviarr.expiryDate) <= priviarr.newEffectiveDate) ||
                      (priviarr.newExpiryDate <= priviarr.newEffectiveDate)){
                     this.expiryDateFlag = false;
                     this.expiryDateErrorMessage = 'Expiry date cannot be in past';
                     priviarr.expiryDate_min = new Date(this.convert(tomorrow));
                     priviarr.expiryDate = moment(priviarr.effectiveDate).add(10, 'years').toDate();
                     }
     }
     }
   }


//pop up for Privillage Branch
// pup up
openDialogPrivi() {
  const dialogRef= this.dialog.open(popforPriviBranch, {disableClose: true
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result != undefined && result.searchType){
       this.SearchType=result.searchType
    }

    if(result != undefined && result.userBranch){
      this.userBranch = result.userBranch; // Defult Branch Data
      this.DefaultB=result.defaultBranch;   // Defult Branch Data

    }
    if(result != undefined && result.defaultBranch){

      let existBranch=[];
      for (let i = 0; i < result.defaultBranch.length; i++) {
        const element = result.defaultBranch[i];
            if(this.todaydate){ //if server time persist
              element.effectiveDate_min = this.todaydate;
              element.expiryDate_min = this.todaydate;
            }else{
              element.effectiveDate_min = new Date();
              element.expiryDate_min = new Date();
            }

            // effective
            element.effectiveDate_max = null;

            // expiry
            element.expiryDate_max = null;


        if(this.checkInPriviArry(this.newdata.previlegeBranches,element)==true){
          console.log('data is duplicate ');
          existBranch.push(element.branchName);
        }
        else{
          this.newdata.previlegeBranches.push(element);
        }
      }
      if(existBranch.length>0){
        this.toast.warning(`Branch Name    ${existBranch} already exists in List`);
      }

    }
     console.log(result.defaultBranch, "this . default branch check")
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


//pop up


getOccurrence(array, value) {
  return array.filter((v) => (v === value)).length;
}

addEvent(type, event) {
  console.log(event.value)
}

SearchType:string
SearchTypeDefault:string
newdata:any={
  categoryId: 0,
  userDepartment: '',
  defaultBranch: {
    addOrRemoveOrUpdate: "",
    branchCode: "",
    isDefault: 0
  },
  description: "",
  email: "",
  id: 0,
  isAdmin: false,
  menuHierarchyId: '',
  mobile: "",
  name: "",
  previlegeBranches: [
  ],
  status: 0,
  userId: "",
  userRoles: [

  ]
}

userFilter: any = { branchCode: '' };
priFilter: any = { branchCode: '' };
roleFilter: any = { roleName: '' };

ngOnInit() {
  AppSetting.defaultBranchcode='';
  this.DepartmentList();
  this.Catddl();
  this.RoleData();


  this.getMenuHierarchy();

  this.authService.getTimeStamp().subscribe(date=>{
    this.todaydate = new Date(date.data.responseData.split("[")[0])
  })

  this.isAdminFlag = JSON.parse(sessionStorage.getItem("all")).data.responseData.user.isAdmin;
}

ngOnDestroy(){
  AppSetting.defaultBranchcode='';
  this.dialog.closeAll();
}


@HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.ctrlKey && (event.keyCode === 83)) {
      event.preventDefault();
      if(document.getElementById('branchSubmit')){
      let element: HTMLElement = document.getElementById('branchSubmit') as HTMLElement;
      element.click();
      }
      else{
      let element: HTMLElement = document.getElementById('submitButton') as HTMLElement;
      element.click();
      }
    }
  }

todaydate;
mindateForList:any;
maxdateForList:any;
EffDatePriviListEvent(eff, exp){
  if(exp.length>8){
    let dateobj = new Date(eff);
    let B = dateobj;
  }
}

ExpDatePriviListEvent(eff, exp){
  if(exp.length>8){
    let dateobj = new Date(exp);
    let B = dateobj;
  }
}

calDisabled;
ExpEffDate(effdate,expDate){
  if(this.convert(effdate) < this.convert(expDate)){
  this.calDisabled= false;
  }
  else{
    this.calDisabled =true;
  }
}





//toggle submit button if date is valid or not
submitBtn:boolean = true;
//compare date on text enter
compareDt(whichItem, manualEntDt,  fildType) {

  //handle empty fild
  this.emptyhandly(whichItem)

    if (
      moment(whichItem.effectiveDate).isValid() &&
      moment(whichItem.expiryDate).isValid() &&
      moment(whichItem.effectiveDate).isBefore(whichItem.expiryDate) &&
      moment(new Date(whichItem.effectiveDate).setHours(0,0,0,0)).isSameOrAfter(this.todaydate.setHours(0,0,0,0))
      ){  //check date is valid or
        whichItem.save =  true; // date is valid
        this.submitBtn = true; // show submit button
    }else{
      whichItem.save =  false; // date is not valid
      this.submitBtn = false; // hide submit butto
    }

  // whichItem.
  let mkDt = manualEntDt.target.value;
  var timestamp = Date.parse(mkDt);

 if (isNaN(timestamp) == false) { //if date is valid
    if(fildType == 'effective'){ // if effective date selected
        whichItem.expiryDate_min =   moment(whichItem.effectiveDate).add(1, 'days').toDate();
    } else if(fildType == 'expiry'){ // if expire date select
        whichItem.effectiveDate_max =  moment(whichItem.expiryDate).subtract(1, 'days').toDate();
    }


}



  // min max effective date change
  if(moment(new Date(whichItem.effectiveDate).setHours(0,0,0,0)).isSameOrBefore(this.todaydate.setHours(0,0,0,0))){
    whichItem.effectiveDate_min = this.todaydate;
  }
  if(moment(new Date(whichItem.expiryDate).setHours(0,0,0,0)).isSameOrBefore(this.todaydate.setHours(0,0,0,0))){
      whichItem.effectiveDate_min = this.todaydate
      whichItem.effectiveDate_max = moment(this.todaydate).add(1000, 'days').toDate()
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
  }
}



validNameFlag: boolean = false;
validateUser(nameobj){
 let name = nameobj.trim();
  if(name.length > 2){
    this.isUserNameHasValue = true;
    this.validNameFlag = true;
  }else {
    this.validNameFlag = false;
  }

}

adminCheck(event){
this.newdata.isAdmin = (event.checked == true) ? 1 : 0;
}

isAdminVisible(event, categoryId){
this.isAdminFlag = (categoryId === 146) ? false : true;
}



// Create User
createUser(){
  this.newdata.name = this.newdata.name.trim();
  if(this.newdata.categoryId==146){
    this.newdata.isAdmin =0;
    }
    else{
  this.newdata.isAdmin = (this.newdata.isAdmin) ? 1 : 0;}
  console.log(this.newdata);
  var headers =({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});

  //this.DepartmentList;
  for (var i = 0; i < this.userDepartmentList.length; i++) {
      if (this.userDepartmentList[i].lookupVal == this.newdata.userDepartment) {
        this.newdata.userDepartment=this.userDepartmentList[i].id;
        break;
      }
  }
  let ob;
  this.httpservice.post(window['config'].API_ENDPOINT+'secure/v1/users',this.newdata,).subscribe(
    data => {
      ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.userCreate = data;
          this.router.navigate(['user-management/user']);
        }
        else{
          this.toast.warning(ob.message, ob.code);
        }
    },
    error=>{
      this.toast.warning(error.error.errors.error[0].description);
    })
}

userDepartmentList =[];
DepartmentList(){
  this.usercreateservice.GetDepartmentList().subscribe((users: any) => {
    this.userDepartmentList=users.data.responseData;
    this.newdata.userDepartment=this.userDepartmentList[0].lookupVal;
  });

}

getMenuHierarchy(){
  this.usercreateservice.getMenuHierarchList().subscribe((res:any ) => {
      if(res.status == "SUCCESS"){
      this.DepartmentHierarchyMenu = res.data.responseData;
      this.newdata.menuHierarchyId = this.DepartmentHierarchyMenu[0].id;
    }else if(res.status == "FAILURE"){
        this.toast.error(`${res.error.error[0].code} : ${res.error.error[0].description}`);
    }
  })
  error => this.toast.error(`${error.error[0].code} : ${error.error[0].description}`);
}


/** @purpose  => validate AD user
    @param {String}
    @headers {String}
    @return {Boolean value}
    @author Gaurv Srivastava
    @url End point.../secure/v1/users/{value}/AD
 */


greentick;
validUser=false;
validateAdUser(value){
  this.validUser = false;
  value = value.trim();
 if(value.length > 2){
  this.SpinnerService.show();
  var headers =({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
  this.httpservice.get<any>(window['config'].API_ENDPOINT+`secure/v1/users/${value}/AD`).subscribe(
    data => {
      let ob = ErrorConstants.validateException(data);
       if(ob.isSuccess){
      this.greentick = data.data.responseData;
      this.validUser = !this.greentick;
      this.SpinnerService.hide();
      }
      else{
            this.SpinnerService.hide();
            this.toast.warning(ob.message,"AD response recieved:");
            this.validUser=true;
            this.greentick = false;
            }
    },
    error => {
      this.SpinnerService.hide();
      console.log('error' , error.error.errors.error[0].description);
      this.validUser=true;
      this.greentick = false;
    });
 }
}
//category Details

Catddl(){
  this.SpinnerService.show();
  var headers = new HttpHeaders({ 'correlationId': '1','branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
  this.httpservice.get<any>(window['config'].API_ENDPOINT+'secure/v1/roles/lookup/USER_CTGY',).subscribe(
    data => {
      this.CatData=data.data;
      this.newdata.categoryId=this.CatData.responseData[0].id;
      this.SpinnerService.hide();
      console.log(this.CatData, "THIS IS CATEGORY DATA");
    });
}


DefaultData(){

}

RoleData(){
  this.SpinnerService.show();
  var headers = new HttpHeaders({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
  this.httpservice.get<any>(window['config'].API_ENDPOINT+'secure/v1/roles',).subscribe(
    data => {
      this.RoleD=data.data;
      this.SpinnerService.hide();
    });
  }

roleSrchData=[];
 roleSearchFilter(str) {
   if(str){
    str = str.term;
    if(str.length > 2 && str){
      let roledata=[...this.RoleD.responseData];
      let temp =  roledata.filter(o =>o.roleName.toLowerCase());
        this.roleSrchData =  temp;
    }else{
      this.roleSrchData = [];
    }
   }else{
      this.roleSrchData = [];
   }
}



userRoles=[];
selectedRole : any;
onroleBranchChanged(obj){
this.selectedRole;
obj.value
  let val = obj.roleName;
  for (let i = 0; i < this.RoleD.responseData.length; i++) {
    if(this.RoleD.responseData[i].roleName == val){
      if(this.checkInRoleArry(this.userRoles,val)==true){
        this.selectedRole ='';
        this.toast.warning('Note: Role already in list...!!');
        this.roleFilter.roleName ="";
      }
      else{
        var arr = this.RoleD.responseData[i];
        arr.addOrRemoveOrUpdate='add';
        arr.effectiveDate_min = this.todaydate;
        arr.effectiveDate = this.todaydate;
        let tomorrow = moment(arr.effectiveDate).add(1, 'days').toDate();
        arr.expiryDate_min = new Date(this.convert(tomorrow));
        arr.expiryDate = moment(arr.effectiveDate).add(10, 'years').toDate();
        this.newdata.userRoles.push(arr);
        this.userRoles.push(arr);
        this.RoleD.responseData.splice(i,1);
        this.ELEMENT_DATA=this.userRoles
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.roleFilter.roleName ="";
        this.selectedRole ='';
        break;
      }

    }
  }
}

validateRole(){
  if(this.userRoles.length > 0){
    return true;
  }else {
    return false;
  }
}

checkInRoleArry = (objArray, val) => {
  for (var i = 0; i < objArray.length; i++) {
      if (objArray[i].roleName.toUpperCase() == val.toUpperCase()) {
          return true;
      }
  }
  return false;
};
// =====================================
// Helper Function for dropdown binding and  Search

CurrentDefault:string
onDefaultBranchChanged(val) {
  this.CurrentDefault=val;
  console.log(this.DefaultB);
  for (let i = 0; i < this.DefaultB.length; i++) {
    if(this.DefaultB[i].branchCode == val){
      this.newdata.defaultBranch.branchCode= this.DefaultB[i].branchCode
      this.newdata.defaultBranch.branchId= this.DefaultB[i].branchId
      this.newdata.defaultBranch.branchName= this.DefaultB[i].branchName
      this.newdata.defaultBranch.email= this.DefaultB[i].email
      this.newdata.defaultBranch.isDefault= this.DefaultB[i].isDefault
      this.newdata.defaultBranch.mobile= this.DefaultB[i].mobile
      this.newdata.defaultBranch.parentBranchId= this.DefaultB[i].parentBranchId
      this.DefaultB.splice(i,1);
      this.Privillage=this.DefaultB;
      console.info(this.Privillage +'dsdsdsdsdsdsdsdsds');

    }
  }
}

priviBranchdata=[];
onpriviBranchChanged(vall){
  for (let i = 0; i < this.Privillage.length; i++){
    if(this.DefaultB[i].branchCode == vall){
      var arr = this.DefaultB[i];
      this.newdata.previlegeBranches.push(arr);
      this.priviBranchdata.push(arr);
      this.DefaultB.splice(i,1);
      console.log(this.priviBranchdata[0].branchCode +'fvsdsdfsdfs');
      this.priFilter.branchCode =""
    }
  }
}

removePriviBranchChanged(vall,j){
this.effectiveDateFlag = true;
this.expiryDateFlag = false;
  for (let i = 0; i < this.newdata.previlegeBranches.length; i++) {
    if((j != null) &&(this.newdata.previlegeBranches[i].branchCode == vall)){
      var arr = this.priviBranchdata[i];
      console.log(this.priviBranchdata);
      this.newdata.previlegeBranches.splice(j, 1);
      this.changeDetectorRef.detectChanges();
    }
  }

}

savePriviBranchChanged(vall,j){
  this.effectiveDateFlag =true;
  this.expiryDateFlag = false;
  console.log(vall,j);
  this.priviFlag=true;
  for (let i = 0; i < this.newdata.previlegeBranches.length; i++) {
    const element = this.newdata.previlegeBranches[i];
    if(element.branchCode==vall){
    let expDate = moment(new Date(this.newdata.previlegeBranches[i].effectiveDate),"dd/MM/yyyy");
         element.effectiveDate=this.convert(this.newdata.previlegeBranches[i].effectiveDate);
         if(this.newdata.previlegeBranches[i].expiryDate == null || this.newdata.previlegeBranches[i].expiryDate <= expDate ){
         element.expiryDate = moment(this.newdata.previlegeBranches[i].effectiveDate).add(10, 'years').toDate();
         }else{
         element.expiryDate=this.convert(this.newdata.previlegeBranches[i].expiryDate);}
         if(element.expiryDate=='NaN-aN-aN'){
          element.expiryDate='Null';
         }
      }
    }
  this.indexval=-1;
}

convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

removeRoleBranchChanged(vall,j){
  for (let i = 0; i < this.userRoles.length; i++) {
    if((j != null) &&(this.userRoles[i].roleName == vall)){
      var arr = this.userRoles[i];
      console.log(this.priviBranchdata);
    }
  }
  this.userRoles.splice(j, 1);
    this.changeDetectorRef.detectChanges();
}

onPrivichecked(){

}
saveRoleChange(whichItem, vall, j) {
    whichItem.saveDateFlg = false;
    var originalPrivilegeBranchData = this.newdata.userRoles.findIndex(object=>(object.roleId === whichItem.roleId));
    if(!this.effectiveDateFlag || this.expiryDateFlag ){
          whichItem.effectiveDate = this.todaydate;
          whichItem.expiryDate = moment(whichItem.effectiveDate).add(10, 'years').toDate();
             if(this.newdata.userRoles[originalPrivilegeBranchData].expiryDate == null ||
             this.newdata.userRoles[originalPrivilegeBranchData].expiryDate <= whichItem.effectiveDate ){
             whichItem.expiryDate = moment(this.newdata.userRoles[originalPrivilegeBranchData].effectiveDate).add(10, 'years').toDate();
             }else{
             whichItem.expiryDate=this.convert(this.newdata.userRoles[originalPrivilegeBranchData].expiryDate);}
          this.expiryDateErrorMessage='';
          this.effectiveDateErrorMessage='';
        }
    else{
    if(!whichItem.isNewRole || originalPrivilegeBranchData <0){
    //this.newdata.userRoles.push(whichItem);
    this.effectiveDateFlag = true;
    this.expiryDateFlag = false;
    }
}
    whichItem.saveIcon=false;
    whichItem.editDate= false;
     var saveIcon= this.newdata.userRoles.filter(o=>o.saveIcon);
          if(saveIcon.length<=0){
          this.expiryDateFlag = false;
          this.effectiveDateFlag = true;
          }
          else{
          this.expiryDateFlag = true;
          this.effectiveDateFlag = false;
          }
    this.isEditRoleFlag = true;
  }

 editRole(whichItem, data) {
      // Add From Pradeep
       var roleDataIndex = this.newdata.userRoles.findIndex(object=>(object.editDate));
       if(roleDataIndex >=0){
       var roleObject = this.newdata.userRoles[roleDataIndex];
       roleObject.editDate=false;
       }
      var saveIcon= this.newdata.userRoles.filter(o=>o.saveIcon);
      if(saveIcon.length<=0){
      this.expiryDateFlag = false;
      this.effectiveDateFlag = true;
      }
      else{
      this.expiryDateFlag = true;
      this.effectiveDateFlag = false;
      }
      whichItem.editDate = true;
      whichItem.saveIcon = true;
      this.isEditRoleFlag = false;
      this.expiryDateErrorMessage='';
      this.expiryDateErrorMessage='';
      // End From Pradeep
      this.indexval = data;
    }


removeRoleList(vall, j) {
this.selectedRole ='';
vall.addOrRemoveOrUpdate='';
this.RoleD.responseData.push(vall);
var index = this.newdata.userRoles.findIndex(object=>(object.roleId === vall.roleId ));
this.newdata.userRoles.splice(index,1);
    for (var i = this.ELEMENT_DATA.length - 1; i >= 0; --i) {
      if (this.ELEMENT_DATA[i].roleName == vall.roleName) {
        this.ELEMENT_DATA.splice(i, 1);
      }
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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
    this.validateUserDetails();
  }

 webData=[]; mobileData=[];
 activeRoleId: any;
getRoledetail(data) {
let webList=[];
let MobileList=[];
this.webData=[]
this.mobileData=[]
  this.roleservice.objectIdList(data)
    .subscribe((users: any) => {
       if (users.data.responseData[0].objectPermissionList.length == 0) {
                this.toast.warning('Role permissions does not exist for this role', 'Permission not found');
              }
              else{
      users.data.responseData[0].objectPermissionList.forEach(element => {
        if(element.channelId==33){
          webList.push(element);
        }
        else{
          MobileList.push(element);
        }
      });
      }
        this.webData=uniqueObj(webList);
        this.mobileData=uniqueObj(MobileList);
        this.WebPermissionSet(this.webData);
        this.MobilePermissionSet(this.mobileData);
        webList=[];
        MobileList=[];
        if(this.activeRoleId == data){
          this.activeRoleId = '';
        }else{
          this.activeRoleId = data;
        }
      })

    }
}

function uniqueObj(data){
  let p = Object.create(null)
  let  Unq = data.reduce(function (r, o) {
        if (!(o.subEntityName in p)) {
            o.permission=[]; p[o.subEntityName] = r.push(o) - 1;
            o.permission.push({permissionId:o.permissionId,permissionType:o.permissionType,id:o.id})
            return r;
        }
        else{
            r.forEach(i => {
                if(i.subEntityName==o.subEntityName  && i.permission.length<3){
                    i.permission.push({permissionId:o.permissionId,permissionType:o.permissionType,id:o.id});
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
  selector: 'dialog-data-example-dialog',
  templateUrl: 'advance_search.html',
  styleUrls: ['../../core.user.css']
})
export class popforDefaultBranch {
model:any={}
branchWild:any=[]
model1:any={}
DefaultB:any;
newdata:any={}
advanceDefaultName:any;
advanceDefaultArea:any;
advanceArea:any;
pinCodeList : any ={}
pinCodeDataLength : any;
twoAPIdata:any;
branchNameFilter: any = { branchName: '' };



constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private authSer:AuthorizationService, private SpinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<popforDefaultBranch>, private httpservice:HttpClient, public router:Router,private toast: ToastrService,) {}

  ngOnInit(){
   this.model.search='NAME';
  }

  searchBranchFlag:boolean=false;
  advanceFlag(){
    this.searchBranchFlag=true;
 }
 //default Branch Advance Search
 showData: any = []
 tableData: any = []

 advanceDefaultBranchName(obj) {
   if(obj.length > 2){
    if (this.model.search == "NAME") {
      var headers = new HttpHeaders({ 'branchCode': 'B1', 'journeyId': 'A1', 'userId': 'User1' });
      let searcgObj=this.model.searchbyname.toUpperCase();
       this.SpinnerService.show();
      this.httpservice.get<any>(window['config'].API_ENDPOINT + `secure/v1/branches/branchName/${searcgObj}`, { headers: headers }).subscribe(
        data => {
          let ob = ErrorConstants.validateException(data);
          if(ob.isSuccess){
           console.log(data, "hello DEFAULT data");
           this.twoAPIdata = data.data;
           this.tableData=data.data;
           this.SpinnerService.hide();
           this.tableData.responseData.forEach(element => {
             if(element.branchType=='REGION'){
              element.regionBranch=element.branchName;
             }
             else if(element.branchType=='CORPORATE'){
              element.regionBranch='';
             }
           });
           this.tabledataLength=this.tableData.responseData.length
           for (let advanceValue of this.twoAPIdata.responseData) {
             this.showData.push(advanceValue);
           }
          }
          else{
            this.SpinnerService.hide();
           this.toast.warning(ob.message, ob.code);
          }
      },
      error=>{
       this.toast.warning(ErrorConstants.getValue(404));
       this.SpinnerService.hide();
      });
    } else {
      var headers = new HttpHeaders({ 'branchCode': 'B1', 'journeyId': 'A1', 'userId': 'User1' });
      this.SpinnerService.show();
      this.httpservice.get<any>(window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/${this.model.searchByType.$ngOptionLabel}`, { headers: headers }).subscribe(
        data => {
          this.advanceArea = data.data;
          this.tableData = data.data;
          this.SpinnerService.hide();
          console.log(this.advanceArea, "Hello two ELSE API DATA");
        });
    }
   }
 }
 areaDataByName
 advanceDefaultBranchArea() {
   this.arr=[];
   this.tableData=[];
   this.areaDataByName =[];
   this.tableData.responseData=[];
   if (this.model.search != "NAME") {
    if(this.model.search == "TYPE"){
      var headers = new HttpHeaders({ 'branchCode': 'B1', 'journeyId': 'A1', 'userId': 'User1' });
      this.SpinnerService.show();
      this.httpservice.get<any>(window['config'].API_ENDPOINT + `secure/v1/branches/types`, { headers: headers }).subscribe(
        data => {
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
    else if(this.model.search != "PINCODE"){
      this.SpinnerService.show();
      var headers = new HttpHeaders({ 'branchCode': 'B1', 'journeyId': 'A1', 'userId': 'User1' });
      this.httpservice.get<any>(window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/${this.model.search}`, { headers: headers }).subscribe(
        data => {
        let ob = ErrorConstants.validateException(data);
                             if(ob.isSuccess){
          this.areaDataByName = data.data;
          this.SpinnerService.hide();
          console.log(this.areaDataByName, "Hello table data");
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
 }
 tabledataLength
 advanceDefaultBranchAreaById() {
  var headers = new HttpHeaders({branchCode: "B1", journeyId: "A1", userId: "User1"});
  this.SpinnerService.show();
  this.httpservice
    .get<any>(
     window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.areaId.branchId,
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
      }},
      Error => {
      console.log('Error');
    });
}

 convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
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
            if (ob.isSuccess) {
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
            else {
            this.toast.warning(ob.message, ob.code);
            this.advancepincode = false;
            this.SpinnerService.hide();
            }
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
                    this.advancepincode = false;
                    this.SpinnerService.hide();
                    if(this.tabledataLength ==0){
                          this.toast.warning('Branches for ' + this.model.apincode.pincode +' pincode are not active in propel-i', 'RECORD_NOT_FOUND');
                          this.advancepincode = false;
                          this.tableData = [];
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
                    this.toast.warning(ob.message, ob.code);
                    this.advancepincode = false;
                    this.SpinnerService.hide();
                  }
                  this.SpinnerService.hide();
                 });
             }

 advancepincode: boolean = false;
 pincode() {
   this.advancepincode = true;
 }
 // end of pincode

allocateAreaData(){

  let defaultBranch=this.finalAreaData;
  let searchTypedata= this.model.search;
  this.dialogRef.close({  defaultBranch, searchTypedata});
}
//default Branch Advance for Area Region
//dropdown list for advance Default Branch Name
advance:any=[]
advanceSearchList:any=[
  {value:"NAME"},
  {value:"AREA",  criteriaValue:"branchtype"},
  {value:"REGION",  criteriaValue:"branchtype"},
  {value:"TYPE", criteriaValue:"branchtype"},
  {value:"PINCODE", criteriaValue:"PINCODE"}
];

onChangeValue(val){
  this.model.search;
}

//for input box change
nameSearchInbox:boolean=false;
inputFlag(val){
if(this.model.serach=='NAME'){
  this.nameSearchInbox=true;
}
}

onChangeValueforBranch(){
  this.branchWild;
}
filterEntity() {
  let userBranch:any;
  let defaultBranch:any=[]
  defaultBranch=this.twoAPIdata.data ;
  userBranch = this.branchWild;
  this.dialogRef.close({  defaultBranch });
  console.log(userBranch, "mobile")
}

filterByArea(data){
for(let advaneAreaFilter of this.advanceArea){
   if( advaneAreaFilter==this.model.area){
     this.tableData.push(advaneAreaFilter)
   }
}
}

filterByType(data){
  for(let advanceTypeFilter of this.advanceArea){
    if (advanceTypeFilter==this.model.area){
      this.tableData.push(advanceTypeFilter)
    }
  }
}


filterByValue(array, string) {
  return array.filter(o => Object.keys(o).some(k => o.branchCode.toLowerCase().includes(string.toLowerCase())));
}

arr=[];
branchDataFilter(filterValue: string) {
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


filterBy
closeDialog(): void {
  this.dialogRef.close();
}


}





//===========================================================================
//pop for privillage branch
//===========================================================================
@Component({
  selector: 'dialog-data-example-dialog-privi',
  templateUrl: 'advance_search_privi.html',
  styleUrls: ['../../core.user.css']
})
export class popforPriviBranch {

  model:any={}
  branchWild:any=[]
  model1:any={}
  DefaultB:any;
  newdata:any={}
  advanceDefaultName:any;
  advanceDefaultArea:any;
  advanceArea:any;
  twoAPIdata:any;
  IsEffDate:any;
  IsExpdate:any;
  pinCodeList : any ={}
  pinCodeDataLength : any;

  IsEffDateForvalidation:Date;
  IsExpdateForvalidation:Date;
  todaydate:Date;
  today;
  expiryDateMaxValidation:Date;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,public dialogRef: MatDialogRef<popforPriviBranch>, private httpservice:HttpClient,public router:Router,private toast: ToastrService,private SpinnerService: NgxSpinnerService , private authSer:AuthorizationService) {
   this.authSer.getTimeStamp().subscribe( date => {
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


  ngOnInit(){
    console.log(this);
    this.model.search='NAME';
    this.IsEffDateForvalidation = new Date(this.todaydate);
    this.authSer.getTimeStamp().subscribe(date=>{
      this.todaydate = new Date(date.data.responseData.split("[")[0]);
      if(this.todaydate){
        this.IsEffDateForvalidation = this.todaydate;
        this.minDateEffe = this.todaydate;
      }else{
        this.IsEffDateForvalidation = new Date();
        this.minDateEffe = new Date()
      }
    })
  }


  orgValueChange(a){
    alert('hello'+a);
  }

  searchBranchFlag:boolean=false;
  advanceFlag(){
    this.searchBranchFlag=true;
    this.model.search='NAME';
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

applyFilter(filterValue) {
  var objectdata:any = this.tableData.filter(function (item) {
    return item;
  })
  this.tableData = new MatTableDataSource(objectdata);
}


filterByValue(array, string) {
  return array.filter(o => Object.keys(o).some(k => o.branchCode.toLowerCase().includes(string.toLowerCase())));
}

arrdata=[];
branchDataFilter(filterValue: string) {

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



 showData:any=[]
 tableData:any=[]


 advanceDefaultBranchName(obj){
  if(obj.length > 2){
   this.tableData=[];
   this.tableData.responseData=[];
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
               console.log(this.finalAreaData +' and '+ this);
               console.log('This is Default');
             }
             else{
                 element.effective_date='';
                 element.expiryDate='';
                 this.tableData.push(element);
                 this.tabledataLength=this.tableData.length;
                 this.showData.push(element);
             }
             this.tableData.forEach(element => {
               if(element.branchType=='REGION'){
                element.regionBranch=element.branchName;
               }
               else if(element.branchType=='CORPORATE'){
                element.regionBranch='';
               }
             });
           }
         }
         else{
           this.SpinnerService.hide();
           this.toast.warning(ob.message,ob.code);
         }
     },
     error=>{
       this.toast.warning(ErrorConstants.getValue(404));
     });
   }
  }

     else{
       var headers = new HttpHeaders({'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
       this.SpinnerService.show();
       this.httpservice.get(window['config'].API_ENDPOINT+`secure/v1/branches/branchtype/${this.model.search}`,  ).subscribe(
         data => {
        let ob = ErrorConstants.validateException(data);
          if(ob.isSuccess){
           this.advanceArea=data;
           this.tableData=this.advanceArea.data
           this.SpinnerService.hide();
           }
           else{
           this.toast.warning(ob.message, ob.code);
           this.SpinnerService.hide();
           }
         });
     }

 }


areaDataByName
advanceDefaultBranchArea() {
this.tableData=[];
this.tableData.responseData=[];
this.arrdata=[];
 this.areaDataByName =[];
 let apiEndPoint ='';

     if (this.model.search != "NAME") {
     if(this.model.search == "TYPE"){apiEndPoint = window['config'].API_ENDPOINT +`secure/v1/branches/types`}
     else if(this.model.search != "PINCODE"){
     apiEndPoint = window['config'].API_ENDPOINT + `secure/v1/branches/branchtype/${this.model.search}`;
     }
       var headers = new HttpHeaders({branchCode: "B1",journeyId: "A1",userId: "User1"});
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
        });

     }
   }
tabledataLength
advanceDefaultBranchAreaById(data) {
  var headers = new HttpHeaders({branchCode: "B1", journeyId: "A1", userId: "User1"});
  this.SpinnerService.show();
  this.httpservice
    .get<any>(
      window['config'].API_ENDPOINT + `secure/v1/branches/${this.model.search}/` + this.model.areaId.branchId,
      { headers: headers }
    )
    .subscribe(data => {
    let ob = ErrorConstants.validateException(data);
    if(ob.isSuccess){
      this.tableDataSortFilter(data, this.model.search, this.advancepincode);
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

 finalAreaData=[]
filterDataByAreaList($event,data){
    if($event.checked==false){
    this.finalAreaData.forEach((element,i) => {
      if(element.branchCode== data.branchCode){
        this.finalAreaData.splice(i,1);
        return
      }
    });
    }
    if($event.checked==true){
      data.addOrRemoveOrUpdate="Add";
    this.finalAreaData.push(data)
    }
}



convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

 getOccurrence(array, value) {
  return array.filter((v) => (v === value)).length;
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
      this.tableDataSortFilter(data, this.model.search, this.advancepincode);
      }
       else{
          this.tableData=[];
          this.toast.warning(ob.message, ob.code);
          this.SpinnerService.hide();
      }},
    (error) => {
      console.log('Error'+error);
      this.SpinnerService.hide();
    });
}

advanceDefaultBranchTypeById(data) {

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
          this.tableDataSortFilter(data, this.model.searchByType, this.advancepincode);
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
           if (ob.isSuccess) {
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
           else {
            this.toast.warning(ob.message, ob.code);
            this.advancepincode = false;
            this.SpinnerService.hide();
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
                if(ob.isSuccess){
                  this.tableDataSortFilter(data,  this.model.searchbypincode, this.advancepincode);
                }else {
                  this.tableData = [];
                  this.toast.warning(ob.message, ob.code);
                  this.advancepincode = false;
                  this.SpinnerService.hide();
                    }
                },
                  Error => {
                  console.log('Error');
                  this.SpinnerService.hide();
                });

          }

  tableDataSortFilter( data,  serachEl, flag){
    this.tableData=[];
    let tempData = data.data.responseData;
    this.SpinnerService.hide();
    for (let i = 0; i < tempData.length; i++) {
      const element = tempData[i];
      if(element.branchCode==AppSetting.defaultBranchcode){
        console.log(this.finalAreaData +' and '+ this);
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

      flag = false;
    }
    if(this.tabledataLength ==0){
      this.toast.warning(serachEl +' does not exist in propel-i', 'RECORD_NOT_FOUND');
      flag = false;
      this.tableData = [];
      }else {
        flag = true;
      }
  }
  advancepincode: boolean = false;
  pincode() {
    this.advancepincode = true;
  }
  // end of pincode



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
    this.IsEffDateForvalidation = moment(this.IsEffDate).add(1, 'days').toDate();}
  }else{
    this.IsEffDateForvalidation = moment(this.today).add(1, 'days').toDate();
  }
  this.validateDt()
}

ExpiryDateEvent(change, $event){
 if(this.IsExpdate.getFullYear() > 9999){
         this.flgSubmitBtn = false;
         this.expiryDateMaxValidation = new Date(this.convert('01/01/9999'));
         this.IsExpdateForvalidation =  moment(this.IsExpdate).subtract(1, 'days').toDate();
         }else{
   this.IsExpdateForvalidation =  moment(this.IsExpdate).subtract(1, 'days').toDate();
   this.validateDt();
   }

}
validateDt(){
  if(
    !this.IsExpdate &&  moment(this.IsEffDate).isAfter(new Date()))
  {
    this.flgSubmitBtn = true
  }else if(
      moment(this.IsEffDate).isBefore(this.IsExpdate) &&
      moment(new Date(this.IsEffDate).setHours(0,0,0,0)).isSameOrAfter(this.todaydate.setHours(0,0,0,0))
    ){
      this.flgSubmitBtn = true // show
    }else{
      this.flgSubmitBtn = false // hide
    }

    // min max effective date change
    if(moment(new Date(this.IsEffDate).setHours(0,0,0,0)).isSameOrBefore(this.todaydate.setHours(0,0,0,0))){
        this.minDateEffe = this.todaydate;
    }

    if(moment(new Date(this.IsExpdate).setHours(0,0,0,0)).isSameOrBefore(this.todaydate.setHours(0,0,0,0))){
      this.minDateEffe = this.todaydate;
      this.IsExpdateForvalidation = moment(this.todaydate).add(1000, 'days').toDate()
    }
}


allocateAreaData(){
this.finalAreaData['isNewBranch']=true;
let defaultBranch=this.finalAreaData;
if(this.IsEffDate && this.IsExpdate){
        this.finalAreaData.forEach(element => {
        element.effectiveDate=this.convert(this.IsEffDate);
        element.expiryDate=this.convert(this.IsExpdate);
      });
      }
      else{
        this.finalAreaData.forEach(element => {
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
let searchType=this.model.search;
  this.dialogRef.close({  defaultBranch,searchType});
}




//default Branch Advance for Area Region
//dropdown list for advance Default Branch Name
advance:any=[]
advanceSearchList:any=[
  {value:"NAME"},
  {value:"AREA",  criteriaValue:"branchtype"},
  {value:"REGION",  criteriaValue:"branchtype"},
  {value:"TYPE", criteriaValue:"branchtype"},
  {value:"PINCODE", criteriaValue:"PINCODE"}
];
onChangeValue(val){
  this.model.search;
}

//for input box change
nameSearchInbox:boolean=false;
inputFlag(val){
if(this.model.serach=='NAME'){
  this.nameSearchInbox=true;
}
}

onChangeValueforBranch(){
  this.branchWild;
}
filterEntity() {
  let userBranch:any;
  let defaultBranch:any=[]
  defaultBranch=this.twoAPIdata.data ;
  userBranch = this.branchWild;
  console.log(userBranch, "mobile")
}

filterByArea(data){
for(let advaneAreaFilter of this.advanceArea){
   if( advaneAreaFilter==this.model.area){
     this.tableData.push(advaneAreaFilter)
   }
}
}

filterByType(data){
  for(let advanceTypeFilter of this.advanceArea){
    if (advanceTypeFilter==this.model.area){
      this.tableData.push(advanceTypeFilter)
    }
  }
}

filterBy

closeDialog(): void {
  this.dialogRef.close();
}



}
