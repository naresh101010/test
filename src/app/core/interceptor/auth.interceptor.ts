import { Observable } from "rxjs/Observable";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/do";

import { AppSetting } from "../../app.setting";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private toast: ToastrService, private router: Router, private SpinnerService: NgxSpinnerService,) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if url is login page then do not attach token
    // if (request.url.includes(window['config'].API_ENDPOINT + "v1/login")) {
    // }

    let token;
    let userId;
    let userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userDetails) {
      token = userDetails.token;
      userId = userDetails.userId;
      if (token) {
        request = request.clone({
          headers: request.headers
            .set("authorization", `${token}`)
            .set("branchCode", "1")
            .set("journeyId", "1")
            // .set('userId', `${AppSetting.userId}`)
            .set("userId", userId),
          withCredentials: true
        });
      }
    }

    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
          // console.log(event.headers);
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
            if (            
                err.error.message == "401 UNAUTHORIZED" ||
                err.error.message == "User is not logged" ||
                err.error.message == "User is not logged in" ||
                err.error.message == "User is not logged-in or session has expired"
              ) {           
                    if(err.url.indexOf('permissions') == -1 && err.url.indexOf('logout') == -1  ){ // show toster except permissions and logout
                      debugger
                      this.toast.warning(err.error.message, err.status.toString());
                      this.router.navigate(["/login"]);
                      setTimeout(()=>{this.SpinnerService.hide() }, 4000)
                    }               
                
              } else if(err.error.errors.error[0].description == 'User must have default branch'){
                  this.toast.warning('User must have default branch.');
                  setTimeout(()=>{this.SpinnerService.hide() }, 4000)
              }
        }
      }
    );
  }
}


