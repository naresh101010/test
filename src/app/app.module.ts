import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes} from "@angular/router";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from "ngx-spinner"; 



import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { ToasterComponent } from './core/component/toster/toaster.component';
import { LoaderComponent } from './userModule/loader/loader.component';
// import { LoaderService } from './core/services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppConfigService } from './AppConfigService.service';
// import { LoaderInterceptorService } from './core/interceptor/loader.interceptor';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from "./angMatModule/material.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { LayoutModule } from '@angular/cdk/layout';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";

import { AppDateAdapter, APP_DATE_FORMATS} from './userModule/date_formate/date.adapter';

import { UserComponent } from './userModule/user/user.component';
import { DialogContentExampleDialog, HomeComponent } from './userModule/role/role.component';
import { RolemanagementComponent } from './userModule/rolemanagement/rolemanagement.component';
import { RolldetailComponent, DialogContentExampleDialogEdit } from './userModule/rolldetail/rolldetail.component';
import { ObjectmanagementComponent } from './userModule/objectmanagement/objectmanagement.component';
import { ObjectcreateComponent } from './userModule/objectcreate/objectcreate.component';
import { ObjectdetailComponent } from './userModule/objectdetail/objectdetail.component';
import { UsercreateComponent, popforDefaultBranch, popforPriviBranch } from './userModule/usercreate/usercreate.component';
import { UserdetailsComponent, popforDefaultBranchDetails, popforPriviBranchDetails } from './userModule/userdetails/userdetails.component';
import { NavigationComponent, trackwayBill } from './userModule/navigation/navigation.component';
import { RepeatChildItemComponent } from './userModule/navigation/repeat-child-item/repeat-child-item.component';
import { AuthGuard } from './authModule/auth.guard';
import { NavDirective } from './userModule/navigation/nav.directive'
import { NumericDirective } from './userModule/numeric.directive';
import { TrackWayBillViewComponent } from './userModule/trackWayBill/track-way-bill-view/track-way-bill-view.component';
import { polyfill as keyboardEventKeyPolyfill } from 'keyboardevent-key-polyfill';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';
import { UserWithoutPermiComponent } from './userModule/user-without-permi/user-without-permi.component';
import { NavPipe } from './userModule/navigation/repeat-child-item/nav.pipe';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
keyboardEventKeyPolyfill();

const appRoutes: Routes =      [       
  { 
    path: 'user-management',  component: NavigationComponent, 
        children: [
            { path: '', component:UserComponent, data: { title: 'UserComponent Component' } },
            { path: 'role', component: RolemanagementComponent, data: { title: 'Role Component' } },
            { path: 'home', component: HomeComponent, data: { title: 'Home Component' } },
            { path: 'roledetail/:roleId/:roleName/:description/:status', component: RolldetailComponent, data: { title: 'Role Component' } },
            { path: 'roledetail/:roleId', component: RolldetailComponent, data: { title: 'Role Component' } },
            { path: 'objectcreate', component: ObjectcreateComponent, data: { title: 'Role Component' } },
            { path: 'object', component: ObjectmanagementComponent, data: { title: 'Role Component' } },
            { path: 'objectdetail/:subEntityName', component:ObjectdetailComponent, data: {title: 'Object Details'}},
            { path: 'user', component: UserComponent, data: { title: 'Role Component' } },
            { path: 'userdetail/:userId', component: UserdetailsComponent, data: { title: 'Role Component' } },
            { path: 'usercreate', component: UsercreateComponent, data: { title: 'Role Component' } },
            { path: 'navigation', component: NavigationComponent, data: {title: 'navigation'}},
            { path: 'track-waybill', component: TrackWayBillViewComponent, data: {title: 'navigation'}},
            { path: 'waybill-tracking', component: UserWithoutPermiComponent, data: {title: 'tracking'}}
        ]
  },


]


@NgModule({
  declarations: [ 
    AppComponent, ToasterComponent,LoaderComponent, DialogContentExampleDialogEdit,
    DialogContentExampleDialog,    
    NavigationComponent,
    trackwayBill,    
    HomeComponent,    
    RolemanagementComponent,    
    RolldetailComponent,    
    ObjectmanagementComponent,    
    ObjectcreateComponent,       
    ObjectdetailComponent,   
    UserComponent,    
    UsercreateComponent,    
    UserdetailsComponent,popforDefaultBranch,popforPriviBranch,    
     popforDefaultBranchDetails, popforPriviBranchDetails,RepeatChildItemComponent,
     NumericDirective,
     NavDirective,
     TrackWayBillViewComponent,
     UserWithoutPermiComponent,
     NavPipe,
     EmptyRouteComponent
  ],
   
  imports: 
  [ 
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgxPermissionsModule.forRoot(),
    RouterModule.forRoot(
      appRoutes //, { useHash: true } 
    ),
    CoreModule,
    NgxSpinnerModule,
    CustomMaterialModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    FlexLayoutModule,
    FilterPipeModule,
    MatProgressSpinnerModule,
    LayoutModule,
    NgxPermissionsModule.forChild(),
    TextInputAutocompleteModule
  ],  
  entryComponents: [
    HomeComponent, DialogContentExampleDialog,RolldetailComponent,DialogContentExampleDialogEdit, UsercreateComponent, popforDefaultBranch,popforPriviBranch, UserdetailsComponent,popforDefaultBranchDetails,popforPriviBranchDetails, NavigationComponent,
    trackwayBill, 
 ],
    providers: [
      // {
      //   provide: APP_INITIALIZER,
      //   multi: true,
      //   deps: [AppConfigService],
      //   useFactory: (appConfigService: AppConfigService) => {
      //     return () => {
      //       return appConfigService.loadAppConfig();
      //     };
      //   },
        
      // },
      {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    { provide: APP_BASE_HREF, useValue: '/' }
    ], 
   bootstrap: [AppComponent]
 })
export class AppModule { }












