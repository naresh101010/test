import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomMaterialModule } from '../angMatModule/material.module';


import { NgxSpinnerModule } from "ngx-spinner"; 
import { NgSelectModule } from '@ng-select/ng-select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { RefreshComponetComponent } from './refresh-componet/refresh-componet.component';
import { ToasterService } from '../core/services/toaster.service';
@NgModule({
  providers:[ToasterService],
  declarations: [LoginComponent, RefreshComponetComponent],
  imports: [
    CustomMaterialModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    FlexLayoutModule,
    LayoutModule, //  canActivate:[AuthGuard]
    RouterModule.forChild([{ path: 'login',  component: LoginComponent }, { path: '',  component: RefreshComponetComponent }])    
  ]
})
export class AuthModule {}

