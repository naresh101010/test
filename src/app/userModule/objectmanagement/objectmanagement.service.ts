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
export class ObjectmanagementService {
  constructor(private http: HttpClient) { }
getobject() {
  // // debugger
  var headers = new HttpHeaders({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
  return this.http.get(window['config'].API_ENDPOINT+'secure/v1/objects/lastUpdated/10',).catch((error: Response) => {
    return Observable.throw("Something went wrong");
  });
}
}
