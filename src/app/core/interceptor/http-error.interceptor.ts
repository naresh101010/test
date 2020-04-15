import {
 HttpEvent,
 HttpInterceptor,
 HttpHandler,
 HttpRequest,
 HttpResponse,
 HttpErrorResponse
} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AppSetting } from 'src/app/app.setting';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
constructor(private toast: ToastrService, public SpinnerService: NgxSpinnerService){
 
}
 intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
return next.handle(request)
.pipe(            
      tap((event:any) => { 
        if(request.url.includes("REGION")){
          this.SpinnerService.show();      
          // setInterval(() => {
            this.SpinnerService.hide();
          //  }, 2000)     
        }        
        })

    );
 }
}



// ===========================================================

// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor, HttpErrorResponse
// } from '@angular/common/http';
// import { AuthServiceService } from './auth-service.service';
// import { Observable, of } from 'rxjs';
// import { catchError } from "rxjs/internal/operators";
// import { CommonThingService } from './common-thing.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(public auth: AuthServiceService, public router: Router, private CommonThingService:CommonThingService) { }
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     request = request.clone({
//       setHeaders: {
//         Authorization: `JWT ${this.auth.getToken()}`
//       }
//     });
//     // return next.handle(request);

//     return next.handle(request).pipe(catchError((error, caught) => {
//       //intercept the respons error and displace it to the console
//       // console.log(error);
//       this.handleAuthError(error);
//       return of(error);
//     }) as any);
//   }
//   private handleAuthError(err: HttpErrorResponse): Observable<any> {
//     //handle your auth error or rethrow
  

    
//     if (err.status === 400) {
//       this.CommonThingService.error.emit({msg:'Bad request.', code:err.status, show:true});                
//       location.reload();
//       return of(err.message);
//     }else if (err.status === 401) {
//       this.CommonThingService.error.emit({msg:'Unauthorized access.', code:err.status, show:true});                
//       this.router.navigate(['/']);
//       // return of(err.message);
//     }else if (err.status === 403) {
//       this.CommonThingService.error.emit({msg:'This IP Address is not allowed.', code:err.status, show:true});                
//       if(this.router.url == '/'){
//         location.reload();
//       }
//       return of(err.message);
//     }else if (err.status === 500) {  
//       // if login page then refresh 
//       if(this.router.url == '/'){
//         location.reload();
//       }
//       //if view page
//       if(this.router.url == '/dashboard/view'){
//         this.router.navigate(['/']);
//       }
//       // if(this.router.url !== '/dashboard'){
//         this.CommonThingService.error.emit({msg:'Server internal error.', code:err.status, show:true});          
//       // }      
//       // this.router.navigate(['/']);
//       return of(err.message);
//     }else if (err.status === 0) {
      
//       this.CommonThingService.error.emit({msg:'Connection refused, Try after some time.', code:err.status, show:true});          
//       this.router.navigate(['/']);
//       location.reload();
//       return of(err.message);
//     }
//     throw Error;
//   }
// }







