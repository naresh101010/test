import { Component, OnInit, Inject, ElementRef, AfterViewInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef  } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import{ AppSetting } from './../../app.setting'
import { HttpModule } from '@angular/http'
// import { CookieService } from 'ngx-cookie-service';
// import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator, MatSort } from "@angular/material";
import { NgxPermissionsService } from 'ngx-permissions';
import {ToastrService} from 'ngx-toastr';


import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { element } from 'protractor';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import { type } from 'os';
import { NgxSpinnerService } from 'ngx-spinner';

export interface PeriodicElement {name: string;userId: number;status: string;symbol: string;}
 const ELEMENT_DATA: PeriodicElement[] = [];

 var userData:any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../../core.user.css']
})
export class UserComponent implements OnInit {
  selectedStatus: any;
  searchUserPlaceHolder : String ='';
  Hold_UserSearchData:[];

  //pagination and sorting
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    paginaFlg = false;
    showHidePagination(len){
      // alert(len.length)
      len.length > 10   ?  this.paginaFlg = true :  this.paginaFlg = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  // end pagination


constructor(private permissionsService: NgxPermissionsService,private toast: ToastrService,
private ref: ChangeDetectorRef, private SpinnerService: NgxSpinnerService,
private httpservice:HttpClient, public router:Router,
public http:HttpModule, private AuthorizationService:AuthorizationService
) { }

ngOnInit() {
  const perm = [];
  this.permissionsService.loadPermissions(this.AuthorizationService.getPermissions('user'));
  this.selectedStatus=3;
  this.UserList();
  this.dataSource.sort = this.sort;

}



userList:any={};
data
dataSource
UserList(){
  this.SpinnerService.show();
    this.httpservice.get<any>(window['config'].API_ENDPOINT+'secure/v1/users/lastUpdated/10',).subscribe(
      data => {
        let ob = ErrorConstants.validateException(data);
        if(ob.isSuccess){
          this.userList=data.data;
          this.Hold_UserSearchData=this.userList.responseData;
          userData = this.userList.responseData;
          let dptLookup=this.userList.referenceData.userDepartmentList;
          userData.forEach(element=>{
          for (var i = 0; i < dptLookup.length; i++) {
              if (element.userDepartment == dptLookup[i].id) {
                element.userDepartment = dptLookup[i].lookupVal;
              }
          }
          let types  = typeof(element.userDepartment);
          if(typeof(element.userDepartment) == 'number'){
            element.userDepartment = '';
          }
          });
          this.dataSource = new MatTableDataSource(userData);
          this.dataSource.sort = this.sort;
          this.SpinnerService.hide();
        }
        else{
          console.log('Error');
          this.SpinnerService.hide();
        }
      },
     error=>{
       console.log('Error');
     } );
  }


 onEdit(data){
  this.router.navigate(['user-management/userdetail',data.userId]);
  }

  displayedColumns: string[] = ['userId', 'name', 'userDepartment',  'email', 'effectiveDate', 'expiryDate', 'status', 'symbol'];
  @ViewChild('TABLE', {static: false}) table: ElementRef;
  @ViewChildren('trachForPagination') trachForPagination:QueryList<ElementRef>;

  ExportTOExcel(){
    let sheetObject: any = [];
    this.dataSource.filteredData.map(obj => {
      let objSheet: any = {}
      objSheet['User ID'] = obj.userId;
      objSheet['Name'] = obj.name;
      objSheet['Email Id'] = obj.email;
      objSheet['Start date'] = obj.effectiveDate;
      objSheet['End date'] = obj.expiryDate;
      objSheet['Department'] = obj.userDepartment;
      objSheet['Status'] = (obj.status == 1) ? 'ACTIVE' : 'INACTIVE';
      sheetObject.push(objSheet);
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetObject);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'userDetails.xlsx');
  }
  searchData:any={};
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      if(this.selectedStatus==1 && filterValue.length>=3 && this.toast.currentlyActive <=0){
         this.httpservice.get<any>(window['config'].API_ENDPOINT+`secure/v1/users/search/userId/${filterValue}`, ).subscribe(
           data => {
            let ob = ErrorConstants.validateException(data);
            if(ob.isSuccess){
              let dptLookup=data.data.referenceData.userDepartmentList;
              data.data.responseData.forEach(element=>{
              for (var i = 0; i < dptLookup.length; i++) {
                  if (element.userDepartment == dptLookup[i].id) {
                    element.userDepartment= dptLookup[i].lookupVal;
                  }
              }
              let types  = typeof(element.userDepartment);
                    if(types == 'number'){
                      element.userDepartment = '';
                    }
              })
              this.searchData=data.data;
              this.dataSource.data = [];
                if(data.data.responseData.length ==0 || !data.data.responseData){
                this.toast.warning('User id ' + filterValue+ ' does not exist in propel-i', 'Record not found');
                }
              this.dataSource = new MatTableDataSource(data.data.responseData);
              this.showHidePagination(data.data.responseData);
            }
            else{
            this.SpinnerService.hide();
              this.dataSource = [];
              this.toast.warning(ob.message, ob.code);
            }
         },
         error => {
         this.SpinnerService.hide();
          console.log('Front End Error');
       });
      }
      if(this.selectedStatus==2 && filterValue.length>=3 && this.toast.currentlyActive <=0){
         this.httpservice.get<any>(window['config'].API_ENDPOINT+`secure/v1/users/search/name/${filterValue}`, )
         .subscribe(
           data => {
            let ob = ErrorConstants.validateException(data);
            if(ob.isSuccess){
              let dptLookup=data.data.referenceData.userDepartmentList;
              data.data.responseData.forEach(element=>{
              for (var i = 0; i < dptLookup.length; i++) {
                  if (dptLookup[i].id == element.userDepartment) {
                    element.userDepartment=dptLookup[i].lookupVal;
                  }
              }
              let types  = typeof(element.userDepartment);
                    if(types == 'number'){
                      element.userDepartment = '';
                    }
              })
              this.searchData= data;
              this.dataSource.data = [];
              if(data.data.responseData.length ==0){
                              this.toast.warning('User Name  ' + filterValue+ ' does not exist in propel-i', 'Record not found');
                              }
              this.dataSource = new MatTableDataSource(this.searchData.data.responseData);
              this.showHidePagination(data.data.responseData);
            }
            else{
              this.toast.warning(ob.message, ob.code);
              this.dataSource = [];
            }
          },
          error=>{
            console.log('Front End Error');
          });
      }
      if(filterValue.length < 3 && this.toast.currentlyActive <=0){
        this.dataSource = new MatTableDataSource(this.Hold_UserSearchData);
        this.dataSource.sort = this.sort;
        if(filterValue.length >=1){
        this.toast.warning('Please enter atleast three characters');}
      }
  }

searchValue
toptendata(a?){
if(this.selectedStatus ==1){
this.searchUserPlaceHolder = 'Search by user id with minimum 3 characters'
}
else if(this.selectedStatus ==2){
this.searchUserPlaceHolder = 'Search by user name with minimum 3 characters'
}
if(this.selectedStatus ==3){
this.searchUserPlaceHolder = ''
}
  this.searchValue='';
    this.dataSource = new MatTableDataSource(this.Hold_UserSearchData);
    this.dataSource.sort = this.sort;
    this.showHidePagination(this.Hold_UserSearchData);
}

validInput(event) {
  if ((event.which == 63 || event.keyCode == 63) || (event.which == 47 || event.keyCode == 47)  || (event.which == 92 || event.keyCode == 92)  ||(event.which == 37 || event.keyCode == 37)  ) {
    return false;

  }else{
    return true;
  }
}

}
