import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptor/http-error.interceptor';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CustomMaterialModule } from '../angMatModule/material.module';
import { AuthorizationService } from './services/authorization.service';
import {ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
@NgModule({
 imports: [ 
    BrowserModule,
    FormsModule, 
    HttpClientModule, 
    HttpModule,
    CustomMaterialModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right'
    })
    
    // ReactiveFormsModule,
    // FilterPipeModule,
    // LayoutModule,
    // FlexLayoutModule,
    // NgSelectModule,
 ],
 providers: [ AuthorizationService,
   {
     provide: HTTP_INTERCEPTORS,
     useClass: HttpErrorInterceptor,
     multi: true
   },
   {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,      
    multi: true,
    },
    CookieService
 ]
})
export class CoreModule { }