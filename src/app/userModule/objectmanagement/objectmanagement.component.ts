import { Component, OnInit, Inject, ElementRef, AfterViewInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource} from '@angular/material/table';
import { ObjectmanagementService} from '../objectmanagement/objectmanagement.service'
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders,} from '@angular/common/http';
import { AppSetting} from './../../app.setting';
import { AuthorizationService } from '../../core/services/authorization.service';
import { MatPaginator, MatSort } from "@angular/material";
import { NgxPermissionsService } from 'ngx-permissions';
import { error, element } from 'protractor';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';



export interface PeriodicElement {
    moduleId: Number,
    objectId: Number,
    entityId: Number,
    moduleName: String,
    entityName: String,
    subEntityName: String,
    channel: String,
    id: Number,
    isPublic: Number,
    permissionId: Number,
    channelId: Number,
    attributeExclutionList: [
      {
        attributeName: String,
        createdBy: String,
        updatedBY: String,
        description: String,
        permissionId: Number,
        objectId: Number,
        objectattribute_id: Number,
        obj_role_perm_map_id: Number,
        effectiveDate: String,
        id: Number
      },
      {
        attributeName: String,
        createdBy: String,
        updatedBY: String,
        description: String,
        permissionId: Number,
        objectId: Number,
        objectattribute_id: Number,
        obj_role_perm_map_id: Number,
        effectiveDate: String,
        id: Number
      },
      {
        attributeName: String,
        createdBy: String,
        updatedBY: String,
        permissionId: Number,
        objectId: Number,
        objectattribute_id: Number,
        obj_role_perm_map_id: Number,
        effectiveDate: String,
        id: Number
      },
      {
        attributeName: String,
        createdBy: String,
        updatedBY: String,
        permissionId: Number,
        objectId: Number,
        objectattribute_id: Number,
        obj_role_perm_map_id: Number,
        effectiveDate: String,
        id: Number
      }
    ],
    status: Number
}
 const ELEMENT_DATA: PeriodicElement[] = [
  {
    moduleId: 4,
    objectId: 1,
    entityId: 0,
    moduleName: "Credit Contract",
    entityName: "Test",
    subEntityName: "SE1",
    channel: "WEB",
    id: 0,
    isPublic: 0,
    permissionId: 0,
    channelId: 0,
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
      },
      {
        attributeName: "objattribute2",
        createdBy: "1",
        updatedBY: "1",
        description: "test attribute description2",
        permissionId: 0,
        objectId: 1,
        objectattribute_id: 0,
        obj_role_perm_map_id: 0,
        effectiveDate: "2019-09-09T12:59:35.568+0000",
        id: 2
      },
      {
        attributeName: "SE31attribute1",
        createdBy: "1",
        updatedBY: "1",
        permissionId: 0,
        objectId: 30,
        objectattribute_id: 0,
        obj_role_perm_map_id: 0,
        effectiveDate: "2019-10-03T11:34:50.178+0000",
        id: 3
      },
      {
        attributeName: "SE31attribute1",
        createdBy: "1",
        updatedBY: "1",
        permissionId: 0,
        objectId: 30,
        objectattribute_id: 0,
        obj_role_perm_map_id: 0,
        effectiveDate: "2019-10-03T11:34:50.178+0000",
        id: 3
      }
    ],
    status: 0
  }
 ];

var userData:any;

@Component({
  selector: 'app-objectmanagement',
  templateUrl: './objectmanagement.component.html',
  styleUrls: ['../../core.user.css']
})
export class ObjectmanagementComponent implements OnInit {
  // httpservice: any;
  constructor(private httpservice:HttpClient,private toast: ToastrService,
    private SpinnerService: NgxSpinnerService,public objectmanagementservice:ObjectmanagementService,
    public router:Router, private AuthorizationService:AuthorizationService, private permissionsService:NgxPermissionsService) { }
//permission
userPermission:any = [];
rolePermission:any = [];
objectPermission:any = [];
//end permission

  //pagination and sorting
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  ngOnInit() {
    this.getObj();
    //permission
    const perm = [];
    this.permissionsService.loadPermissions(this.AuthorizationService.getPermissions('object'));
    // //end permission
  }
  sendViewId(a){
  debugger
    this.router.navigate(['user-management/objectdetail',a.objectId]);
  }
  dataSource;
  objectlist:Object[] = []
  Hold_SearchData:{}= {};


  // pagination
    paginaFlg = false;
    showHidePagination(){
      this.dataSource.data && this.dataSource.data.length > 10   ?  this.paginaFlg = true :  this.paginaFlg = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  // end pagination
  getObj() {
    // debugger
    this.SpinnerService.show();
    this.objectmanagementservice.getobject().subscribe((users: any) => {
      let ob = ErrorConstants.validateException(users);
        if(ob.isSuccess){
        let distinctObjects =[];
        //let distinctObjects = Array.from(new Set(users.data.responseData.map((item: any) => item.objectId)))
        let temp =users.data.responseData;
       const objectMap = new Map();
       for (const object of temp) {
           if(!objectMap.has(object.objectId)){
               objectMap.set(object.objectId, true);    // set any value to Map
               distinctObjects.push(object);
           }
       }
          this.objectlist = distinctObjects;
          userData = distinctObjects;
          this.Hold_SearchData = distinctObjects;
          this.dataSource = new MatTableDataSource(distinctObjects);
          this.SpinnerService.hide();
          this.showHidePagination();
        }
        else{
          this.SpinnerService.hide();
          this.toast.warning(ob.message, ob.code);
        }

    },
    error=>{
      this.SpinnerService.hide();
      this.toast.warning(ErrorConstants.getValue(404));
    });
  }
  displayedColumns: string[] = ['subEntityName', 'moduleName', 'entityName', 'symbol'];
  @ViewChild('TABLE', {static: false}) table: ElementRef;

  ExportTOExcel(){
    let sheetArray: any= [];
    this.dataSource.filteredData.map(obj=> {
      let sheetObj:any = {};
      sheetObj['Object Name'] = obj.subEntityName;
      sheetObj['Function Module'] = obj.moduleName;
      sheetObj['Section Name'] = obj.entityName;

      sheetArray.push(sheetObj);

    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetArray);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Object_details1');
    XLSX.writeFile(wb, 'Object_details.xlsx');
  }

  validInput(event) {
    if ((event.which == 63 || event.keyCode == 63) || (event.which == 47 || event.keyCode == 47)  || (event.which == 92 || event.keyCode == 92)  ||(event.which == 37 || event.keyCode == 37)  ) {
      return false;
    }else{
      return true;
    }
  }

applyFilter(filterValue: string) {
      if(filterValue.length < 3 && this.toast.currentlyActive <=0){
        this.dataSource.data = this.Hold_SearchData;
        this.showHidePagination();
        if(filterValue.length >=1){
        this.toast.warning('Please enter at least three characters');
        }
        // this.getObj();
      }
      else if(filterValue.length>=3 && this.toast.currentlyActive <=0){
      this.httpservice.get<any>(window['config'].API_ENDPOINT+`secure/v1/objects/name/${filterValue}`,).subscribe(
        data => {
          let ob = ErrorConstants.validateException(data);
          if(ob.isSuccess){
          let temp =data.data.responseData;
          const distinctObject = [];
                 const objectMap = new Map();
                 for (const object of temp) {
                     if(!objectMap.has(object.objectId)){
                         objectMap.set(object.objectId, true);    // set any value to Map
                         distinctObject.push(object);
                     }
                 }
            this.dataSource.data= [];
            this.dataSource.data = distinctObject;
            this.showHidePagination();
          }
         else{
          this.dataSource = new MatTableDataSource([]);
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
