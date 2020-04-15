import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSetting } from "../../app.setting";

@Injectable({
  providedIn: 'root'
})
export class UserdetailsService {

constructor(private http: HttpClient) { }


headerData={ 
  'branchCode':AppSetting.branchCode,
  'journeyId':AppSetting.journeyId, 
  'userId': AppSetting.userId
}
    
//create User Service
createusr(usrdata) {
  var headers = new HttpHeaders(this.headerData);
  return this.http.post(window['config'].API_ENDPOINT+'secure/um/v1/users', usrdata,)
  .catch((error: Response) => {
    return Observable.throw("Something went wrong");
  });
}


}
