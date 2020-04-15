import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers} from '@angular/http';
import 'rxjs/Rx';
import { AppSetting } from '../../app.setting';
import { NgxSpinnerService } from "ngx-spinner"; 
import {ToastrService} from 'ngx-toastr';
import { ErrorConstants }  from '../../core/interceptor/ErrorHnadle';


@Injectable({
  providedIn: 'root'
})
export class RolecreateService {

  constructor(private toast: ToastrService,private SpinnerService: NgxSpinnerService,private http: HttpClient) { }
 


createRole(data: any) {
// // debugger
const headers = { 'branchCode':'B1','journeyId':'A1', 'userId': 'User111'};
console.log(data,"testtttt")
return this.http.post(window['config'].API_ENDPOINT+"secure/v1/roles", data, { headers: headers })    
  .map(response => {
     return response;
  }, (error: any) => {
    this.toast.warning(ErrorConstants.getValue(404));
    console.log(error);
  });
}

editRole(data:any) {
  const headers = { 'branchCode':'B1','journeyId':'A1', 'userId': 'User111'};
  return this.http.put(window['config'].API_ENDPOINT+'secure/v1/roles',  data, { headers: headers })
    .map(response => {
      return response;
    }, 
    (error: any) =>   
    {
      this.toast.warning(ErrorConstants.getValue(404));
        console.log(error); 
    });
}

  getroles() {
    // // debugger
    this.SpinnerService.show();
    const header = new Headers();
    header.append('Content-Type', 'application/json');
   var headers =new HttpHeaders ({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});

    return this.http.get(window['config'].API_ENDPOINT+'secure/v1/roles/lastUpdated/10',)
    .map(
      (response: Response) => {
        const data = response;
        return data;
      }
    )
    .catch(
      (error: Response) => {       
      this.toast.warning(ErrorConstants.getValue(404));
      return Observable.throw('Something went wrong');
      }
    );
    this.SpinnerService.hide(); 
}

  objectList() {
    // // debugger
    this.SpinnerService.show();
    var headers =new HttpHeaders ({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});
    return this.http.get(window['config'].API_ENDPOINT+'secure/v1/objects',)
    .map(
      (response: Response) => {
        const data = response;
        return data;
      }
    )
    .catch(
      (error: Response) => {       
      this.toast.warning(ErrorConstants.getValue(404));
      return Observable.throw('Something went wrong');
      }
    );
    this.SpinnerService.hide(); 
}

objectIdList(data) {
  // // debugger
  this.SpinnerService.show();
  var headers =new HttpHeaders ({ 'branchCode':'B1','journeyId':'A1', 'userId': 'User1'});

  return this.http.get(window['config'].API_ENDPOINT+'secure/v1/roles/'+ data+'/permissions',)
  .map(
    (response: Response) => {
      const data = response;
      this.SpinnerService.hide();
      return data;
    }
  )
  .catch(
    (error: Response) => {     
    this.toast.warning(ErrorConstants.getValue(404));  
    return Observable.throw('Something went wrong');
    }
  );
  this.SpinnerService.hide(); 
}
}
