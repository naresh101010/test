import { Component, OnInit, HostListener, ElementRef, AfterViewInit, ViewChild, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource} from '@angular/material/table';
import { RolecreateService } from "./../role/rolecreate.service";
import { Router} from '@angular/router';
import { NgxPermissionsService } from "ngx-permissions";
import { AppSetting } from './../../app.setting';
import { HttpClient} from '@angular/common/http';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { MatPaginator, MatSort } from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import { NgxSpinnerService } from 'ngx-spinner';

export interface PeriodicElement {
  name: string;
  position: number;
  status: string;
  symbol: string;
 }
 const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Create Contract Terms & Condition', status: 'Active', symbol: 'View'},
  {position: 2, name: 'Create Contract', status: 'Active', symbol: 'View'},
  {position: 3, name: 'Create Contract', status: 'Active', symbol: 'View'},
  {position: 4, name: 'Create Contract Terms', status: 'Active', symbol: 'View'},
  {position: 5, name: 'Create Contract Branch Assignment', status: 'Active', symbol: 'View'},
  {position: 1, name: 'Create Contract Terms & Condition', status: 'Active', symbol: 'View'},
  {position: 2, name: 'Create Contract', status: 'Active', symbol: 'View'},
  {position: 3, name: 'Create Contract', status: 'Active', symbol: 'View'},
  {position: 4, name: 'Create Contract Terms', status: 'Active', symbol: 'View'},
  {position: 5, name: 'Create Contract Branch Assignment', status: 'Active', symbol: 'View'},
 ];

var rolelist:any


@Component({
  selector: 'app-rolemanagement',
  templateUrl: './rolemanagement.component.html',
  styleUrls: ['../../core.user.css']
})
export class RolemanagementComponent implements OnInit {
  constructor(private toast: ToastrService,private permissionsService:NgxPermissionsService, private ref: ChangeDetectorRef, private httpservice:HttpClient,private SpinnerService: NgxSpinnerService,public roleservice:RolecreateService, public router:Router, private AuthorizationService:AuthorizationService ) { }

ngOnInit() {
  this.onGet();
  this.permissionsService.loadPermissions(this.AuthorizationService.getPermissions('role'))
}

// pagination
paginaFlg = true;
@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;

showHidePagination(){
  this.dataSource.data && this.dataSource.data.length > 10   ?  this.paginaFlg = true :  this.paginaFlg = false;
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
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
dataSource;
 holdTopTen:[]
onGet() {
    this.SpinnerService.show();
    this.roleservice.getroles().subscribe((users: any) => {
      let ob = ErrorConstants.validateException(users);
      if(ob.isSuccess){
        rolelist =users.data.responseData;
         this.holdTopTen=users.data.responseData;
        this.dataSource = new MatTableDataSource(rolelist);
        this.SpinnerService.hide();
        this.showHidePagination();
      }
      else{
        this.toast.warning(ob.message, ob.code);
      }
    error =>{
      this.toast.warning(ErrorConstants.getValue(404));
    }
  });
}

//status
  status:any = [
    { value: "ACTIVE", id: 1 },
    { value: "INACTIVE", id: 0 }
  ];

validInput(event) {
  if ((event.which == 63 || event.keyCode == 63) || (event.which == 47 || event.keyCode == 47)  || (event.which == 92 || event.keyCode == 92)  ||(event.which == 37 || event.keyCode == 37)  ) {
    return false;

  }else{
    return true;
  }
}
onEdit(data){
  this.router.navigate(['user-management/roledetail', data.roleId]);
}

displayedColumns: string[] = ['roleName','Start_Date', 'End_Date', 'status', 'vewdetail'];
@ViewChild('TABLE', {static: false}) table: ElementRef;
// ExportTOExcel(){
//   debugger
//   let dataForDownload:any=this.dataSource.filteredData;
//   dataForDownload.forEach(element => {
//     if(element.status==1){
//       element.status='ACTIVE';
//     }
//     else{
//       element.status='INACTIVE'
//     }
//   });
//   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//   XLSX.writeFile(wb, 'SheetJS.xlsx');
// }

ExportTOExcel(){
  let sheetObject: any = [];
  this.dataSource.filteredData.map(obj => {
    let objSheet: any = {}
    objSheet['Role Name'] = obj.roleName;
    objSheet['Start Date'] = obj.effectiveDate;
    objSheet['End Date'] = obj.expiryDate;
    objSheet['Status'] = (obj.status == 1) ? 'ACTIVE' : 'INACTIVE';
    sheetObject.push(objSheet);
  })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetObject);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Role Details1');
    XLSX.writeFile(wb, 'Role Details.xlsx');
}
applyFilter(filterValue: string) {
  filterValue = filterValue.trim();
      if(filterValue.length < 3 && this.toast.currentlyActive <=0){
        this.dataSource.data = [];
        this.dataSource.data = this.holdTopTen;
        if(filterValue.length >=1){
        this.toast.warning('Please enter at least three characters');}
      }
      else if(filterValue.length>=3 && this.toast.currentlyActive <=0){
      this.httpservice.get<any>(window['config'].API_ENDPOINT+`secure/v1/roles/roleName/${filterValue}`).subscribe(
        data => {
          let ob = ErrorConstants.validateException(data);
          if(ob.isSuccess){
             if(data.data.responseData.length ==0){
               this.toast.warning('Role name ' + filterValue+ ' does not exist in propel-i', 'Record not found');
              }
            this.dataSource.data =  data.data.responseData;
            this.showHidePagination();
          }
          else{
            this.dataSource.data=[];
            this.toast.warning(ob.message, ob.code);
          }
      },
      error=>{
        this.toast.warning(ErrorConstants.getValue(404));
      });
    }
    this.showHidePagination();
  }
}
