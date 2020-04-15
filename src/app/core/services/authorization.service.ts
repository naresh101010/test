import { Injectable, HostListener } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSetting } from "../../app.setting";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import SimpleCrypto from "simple-crypto-js";
import { ErrorConstants } from "../../core/interceptor/ErrorHnadle";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class AuthorizationService {
  loginPermission: any = {};
  loginMenu: any = {};
  model: any = {};

  //Roles permission
  private permissionSub$ = new BehaviorSubject(null);
  public permission$ = this.permissionSub$.asObservable();

  private userDetailsSub$ = new BehaviorSubject(null);
  public userDetails$ = this.userDetailsSub$.asObservable();


  // end Roles permission
  constructor(
    private httpservice: HttpClient,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private HttpClient: HttpClient,
    private toast: ToastrService
  ) {
      // if(JSON.parse(sessionStorage.getItem("userDetails"))) {
      //   this.getPermi(JSON.parse(sessionStorage.getItem("userDetails")).userId);
      // }
  }

   user = [];
   role = [];
   object = [];
   isAdmin:boolean;
  setPermission(response) {
    let response_ = response.data.responseData;
    // console.log(permission)
    this.isAdmin =  response_.user.isAdmin;

    //if user is admin
    if (response_.user.isAdmin) {
      this.user = ["CREATE", "READ", "UPDATE"];
      this.role = ["CREATE", "READ", "UPDATE"];
      this.object = ["CREATE", "READ", "UPDATE"];
    } else if (response_.menu[0].childMenu.length > 0) {
      // if not admin
      response_.menu[0].childMenu.map(item => {
        if (item.menuLabel == "USER") {
          item.permissions.map(v => {
            // user.indexOf(v.channelId) !== -1 ? "" : user.push(v.channelId);
            // extract only web permission
            if (v.channelId == 33) {
              this.user.indexOf(v.permissionType) !== -1
                ? ""
                : this.user.push(v.permissionType);
            }
          });
        } else if (item.menuLabel == "ROLE") {
          item.permissions.map(v => {
            // role.indexOf(v.channelId) !== -1 ? "" : role.push(v.channelId);
            // extract only web permission
            if (v.channelId == 33) {
              this.role.indexOf(v.permissionType) !== -1
                ? ""
                : this.role.push(v.permissionType);
            }
          });
        } else if (item.menuLabel == "OBJECT") {
          item.permissions.map(v => {
            // object.indexOf(v.channelId) !== -1 ? "" : object.push(v.channelId);
            // extract only web permission
            if (v.channelId == 33) {
              this.object.indexOf(v.permissionType) !== -1
                ? ""
                : this.object.push(v.permissionType);
            }
          });
        }
      });
    } else {
      alert("permission error");
      this.router.navigate(["/login"]);
      return;
    }



    let user = this.user;
    let role = this.role;
    let object = this.object;
    this.permissionSub$.next({ user, role, object });
    sessionStorage.setItem("permissions", JSON.stringify({ user, role, object }));
  }

  getPermissions(section) {
    // debugger
    const permi = JSON.parse(sessionStorage.getItem("permissions"));
    if (section == "user" && permi.user) {
      return permi.user;
    } else if (section == "object" && permi.object) {
      return permi.object;
    } else if (section == "role" && permi.role) {
      return permi.role;
    }
  }

  setUserDetails(userDetails: { userId: string; token: any;}) {
    this.userDetailsSub$.next(userDetails);
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
  }
  getUserDetails() {
    return JSON.parse(sessionStorage.getItem("userDetails"));
  }

  logout() {
    this.spinnerService.show();
    this.httpservice
      .post<any>(window['config'].API_ENDPOINT_AUTH + "secure/v1/logout", {})
      .subscribe(user => {
        this.spinnerService.hide();
        this.router.navigate(["/login"]);
        this.user = [];
        this.role = [];
        this.object = [];

      }, err=>{
        this.router.navigate(["/login"]);
        this.spinnerService.hide()
      });
  }

  clearLocalStroage() {
    sessionStorage.removeItem("userDetails");
    sessionStorage.removeItem("permissions");
    sessionStorage.removeItem("menu");
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("menuNew");
    sessionStorage.removeItem("all");
  }

  getMenu() {
    return JSON.parse(sessionStorage.getItem("menuNew"));
  }

  getPermi(user) {
    var headers = { branchCode: "B1", journeyId: "A1", userId: user };
    this.httpservice
    .get<any>(window['config'].API_ENDPOINT_AUTH + "secure/v1/permissions")
      //.get<any>(window['config'].API_ENDPOINT_LOCAL + "no_per")
    .subscribe(data => {

        //if user has no permission navigate to tracking page
        if(data.data.responseData.menu &&  data.data.responseData.menu.length == 0){
          this.router.navigate(["/user-management/waybill-tracking"]);
          sessionStorage.setItem(
            "menuNew",
            JSON.stringify(data.data.responseData.menu)
          );
          sessionStorage.setItem("all", JSON.stringify(data));
          return
        }



        
        //if user has permission
        sessionStorage.setItem(
          "menuNew",
          JSON.stringify(data.data.responseData.menu)
        );
        this.setPermission(data);
        sessionStorage.setItem("all", JSON.stringify(data));
        this.loginPermission = data;

        


        //if user has no permission and isAdmin is false --- backup code
        // if(!this.isAdmin  && this.user.length == 0 && this.object.length == 0 && this.role.length == 0){
        //   this.toast.warning('This user has no permissions.', ' ');
        //   this.logout();
        //   this.clearLocalStroage();
        //   return
        // }

        // not navigate if user on inner page
        if (window.location.href.indexOf("login") != -1) {
          this.router.navigate(["/user-management/object"]);
        }
      }, err => {
        // if user has no permission, navigate to waybill | disable nav | disable user detail
        if (err.error.message == "401 UNAUTHORIZED"){
            this.router.navigate(["/user-management/waybill-tracking"]);
        }

        // if ( // if token is not valide then do not call logout call
        //   err.error.message == "401 UNAUTHORIZED" ||
        //   err.error.message == "User is not logged" ||
        //   err.error.message == "User is not logged in" ||
        //   err.error.message == "User is not logged-in or session has expired"
        // ) {
        //   this.router.navigate(["/login"]);
        //   this.clearLocalStroage();
        // } else{
        //   this.logout();
        // }
      });
  }


  postMenu() {
    this.httpservice
      .get(window['config'].API_ENDPOINT + "secure/v1/menu")
      .subscribe(data => {
        this.loginMenu = data;
      });
  }

  // get time stamp
  getTimeStamp() {
    return this.HttpClient.get<any>(
      "http://internal-a4442250f27aa11ea9bac0a3257c4306-879971059.ap-south-1.elb.amazonaws.com/secure/v1/users/serverTime"
    );
  }

  //this function return a encrept txt
  encreptIt(txt: string) {
    const _secretKey = "989873298798798787638374";
    const simpleCrypto = new SimpleCrypto(_secretKey);
    return simpleCrypto.encrypt(txt);
  }

  //this function return a deencrept txt
  dencreptIt(txt: string) {
    const _secretKey = "989873298798798787638374";
    const simpleCrypto = new SimpleCrypto(_secretKey);
    return simpleCrypto.decrypt(txt);
  }
}
