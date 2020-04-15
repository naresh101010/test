import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import "rxjs/Rx";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSetting } from "../../app.setting";

@Injectable({
  providedIn: 'root'
})
export class ObjectdetailService {

constructor(private http: HttpClient) { }

getObjectDetails(a) {
  var headers = new HttpHeaders({ 'branchCode':AppSetting.branchCode,'journeyId':AppSetting.journeyId, 'userId': AppSetting.userId});
  return this.http.get(window['config'].API_ENDPOINT+'secure/v1/objects/name/'+a,{headers:headers})
  .map(
    (response: Response) => {
      const a = response;
      return a;
    }
  )
  .catch(
    (error: Response) => {
    return Observable.throw('Something went wrong');
    }
  );
}


getObjectDetailById(a) {
  // debugger
  var headers = new HttpHeaders({ 'branchCode':AppSetting.branchCode,'journeyId':AppSetting.journeyId, 'userId': AppSetting.userId});
  return this.http.get(window['config'].API_ENDPOINT+'secure/v1/objects/objectId/'+a,{headers:headers})
  .map(
    (response: Response) => {
      const a = response;
      return a;
    }
  )
  .catch(
    (error: Response) => {
    return Observable.throw('Something went wrong');
    }
  );
}

onedit(){
  var headers = new HttpHeaders({ 'branchCode':AppSetting.branchCode,'journeyId':AppSetting.journeyId, 'userId': AppSetting.userId});
  return this.http.put(window['config'].API_ENDPOINT+'secure/v1/object',{headers:headers}).catch((error: Response) => {
    return Observable.throw("Something went wrong");
  });
}

getObjSectionDtls(){
  var headers = new HttpHeaders({ 'branchCode':AppSetting.branchCode,'journeyId':AppSetting.journeyId, 'userId': AppSetting.userId});
  return this.http.get(window['config'].API_ENDPOINT+'secure/v1/section/{menuId}',{headers:headers}).catch((error: Response) => {
    return Observable.throw("Something went wrong");
  });
}


postObjSectionDtls(){
  var headers = new HttpHeaders({ 'branchCode':'B1','journeyId':'A1', 'userId': 'user111'});
  return this.http.post(window['config'].API_ENDPOINT+'secure/v1/section',{headers:headers}).catch((error: Response) => {
    return Observable.throw("Something went wrong");
  });
}

isPublicFun(data){
 let headers = new HttpHeaders({ 'branchCode':'B1','journeyId':'A1', 'userId': 'user111'});


let body = { "entityId": data.entityId, "isAddOrRemoveOrUpdate": "update", "isPublic": data.isPublic,"objectId": data.objectId,
              "subEntityName": data.subEntityName
              };
  console.log('headers',body);
   return this.http.put(window['config'].API_ENDPOINT+'secure/v1/objects',body, {headers:headers}).catch((error: Response) => {
    return Observable.throw("Something went wrong");
   });
}

}
