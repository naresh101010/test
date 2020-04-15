import { Component, OnInit } from '@angular/core';
import{ObjectdetailService} from '../objectdetail/objectdetail.service'
import{ AppSetting} from '../../app.setting'
import { ActivatedRoute , Router} from '@angular/router';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-objectdetail',
  templateUrl: './objectdetail.component.html',
  styleUrls: ['../../core.user.css', 'objectdetail.component.css']
})
export class ObjectdetailComponent implements OnInit {

constructor(private SpinnerService: NgxSpinnerService,private toast: ToastrService,public objectdetailservice:ObjectdetailService, public route:ActivatedRoute , public router: Router ) { }

//Variables
selectedValue:{};
selectedIndex;


ObjectModel:any={
  "Attribute":""
};
objectData : any;
ddata :any={
  "moduleId": Number,
  "objectId": Number,
  "entityId": Number,
  "moduleName": String,
  "entityName": String,
  "subEntityName":String,
  "channel": String,
  "id": Number,
  "isPublic": 0,
  "permissionId": Number,
  "channelId": Number,
  "attributeExclutionList": [
    {
      "attributeName": String,
      "createdBy": String,
      "updatedBY": String,
      "description": String,
      "permissionId": Number,
      "objectId": Number,
      "objectattribute_id": Number,
      "obj_role_perm_map_id": Number,
      "effectiveDate":String,
      "id": Number
    }
  ],
  "status": Number
};

editObjectModel:any={
  attributeExclutionList: [
    {
      "addOrRemoveOrUpdate": "string",
      "attributeName": "string",
      "attributeType": "string",
      "createdBy": "string",
      "description": "string",
      "effectiveDate": {
        "date": 0,
        "day": 0,
        "hours": 0,
        "minutes": 0,
        "month": 0,
        "nanos": 0,
        "seconds": 0,
        "time": 0,
        "timezoneOffset": 0,
        "year": 0
      },
      "expiryDate": {
        "date": 0,
        "day": 0,
        "hours": 0,
        "minutes": 0,
        "month": 0,
        "nanos": 0,
        "seconds": 0,
        "time": 0,
        "timezoneOffset": 0,
        "year": 0
      },
      "id": 0,
      "isAddorUpdate": "string",
      "obj_role_perm_map_id": 0,
      "objectId": 0,
      "objectattribute_id": 0,
      "permissionExclusion": "string",
      "permissionId": 0,
      "status": 0,
      "updatedBY": "string"
    }
  ],
  "channel": "string",
  "channelArr": [
    0
  ],
  "channelId": 0,
  "channelList": [
    0
  ],
  "createdBy": "string",
  "description": "string",
  "effectiveDate": {
    "date": 0,
    "day": 0,
    "hours": 0,
    "minutes": 0,
    "month": 0,
    "nanos": 0,
    "seconds": 0,
    "time": 0,
    "timezoneOffset": 0,
    "year": 0
  },
  "entityId": 0,
  "entityName": "string",
  "expiryDaye": {
    "date": 0,
    "day": 0,
    "hours": 0,
    "minutes": 0,
    "month": 0,
    "nanos": 0,
    "seconds": 0,
    "time": 0,
    "timezoneOffset": 0,
    "year": 0
  },
  "id": 0,
  "isAddOrRemoveOrUpdate": "string",
  "isAddOrUpdate": "string",
  "isPublic": 0,
  "moduleId": 0,
  "moduleName": "string",
  "objectId": 0,
  "permissionId": 0,
  "permissionType": "string",
  "public": 0,
  "status": 0,
  "subEntityName": "string",
  "updatedBy": "string"
};

isWeb: boolean = false;
isMobile: boolean = false;
ngOnInit() {
  this.getObjDtl();
}

getObjDtl() {
  var subEntityName:any;
  var objectId :any;
  this.route.params.subscribe(params => {
  if(params["subEntityName"]){
    objectId = params["subEntityName"];
  }});
  this.SpinnerService.show();
  this.objectdetailservice.getObjectDetailById(objectId).subscribe((userDtl: any) => {
    let ob = ErrorConstants.validateException(userDtl);
     this.isWeb = false;
     this.isMobile = false;
    if(ob.isSuccess){
    this.objectData = userDtl.data.responseData;
          for(let data of this.objectData){
          if(data.channelId ==33){
          this.isWeb = true;}
          if(data.channelId ==34){
          this.isMobile = true;
          }
          }
      this.ddata=userDtl.data.responseData[0];
      this.ddata.isPublic = (this.ddata.isPublic) ? true : false;
    }
    else{
      this.toast.warning(ob.message, ob.code);
    }
    this.SpinnerService.hide();
   },
   (error:any)=>{
    this.SpinnerService.hide();
    this.toast.warning(ErrorConstants.getValue(404));
   });

}

editObject(){
  if(this.ddata.isPublic){
    this.ddata.isPublic = 1;
  }else {
    this.ddata.isPublic = 0;
  }



  this.objectdetailservice.isPublicFun(this.ddata).subscribe(data => {
           let ob = ErrorConstants.validateException(data);
           if(ob.isSuccess){
              let msg = data
              this.toast.success(msg["data"].responseData);
             this.router.navigate(["user-management/object"]);
           }
           else{
             this.toast.warning(ob.message, ob.code);
           }
         },
         error=>{
           this.toast.warning(ErrorConstants.getValue(404));
         });




}

getObjectsectionDetails(){
  this.objectdetailservice.getObjSectionDtls().subscribe((userDtl: any) => {
    console.log(userDtl, );
  },
  (error:any)=>{
   console.log('Error...!!!!');
  });
}

PostObjectsectionDetails(){
  this.objectdetailservice.postObjSectionDtls().subscribe((Docc: any) => {
    console.log(Docc);
  },
  (error:any)=>{
    console.log('Error...!!!!');
  });
}

myFunction(val,index){
  this.selectedIndex=index;
  this.selectedValue=val;
}

goforEdit(){
    if(this.ObjectModel.Attribute=="" && this.selectedIndex != undefined){
      this.ObjectModel.Attribute=this.ddata.attributeExclutionList[this.selectedIndex].attributeName;
    }
    else{
      console.log("First Need to remove or add value of text box ");
    }
}

isPublicChange(event){
this.ddata.isPublic = (event.checked == true) ? 1 : 0;
}

add(){
    if(this.ObjectModel.Attribute==""){
      console.log("First Need to type value ");
    }
    else{
      this.ddata.attributeExclutionList[this.selectedIndex].attributeName=this.ObjectModel.Attribute
      this.ObjectModel.Attribute="";
    }
}

}
