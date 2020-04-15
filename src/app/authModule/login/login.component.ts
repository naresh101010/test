import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

import { AuthorizationService } from "../../core/services/authorization.service";
import { ToasterService } from "src/app/core/services/toaster.service";
import { AppSetting } from "../../app.setting";
import { ErrorConstants } from "../../core/interceptor/ErrorHnadle";
import { AppConfigService } from "src/app/AppConfigService.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["../../core.user.css"]
})
export class LoginComponent implements OnInit {
  holdCredential: {
    username: any;
    password: any;
    channelId: number;
  } = { username: "", password: "", channelId: 33 };
  loginCreate: any;
  credentials: boolean = false;
  config:any;
  rememberMe: boolean = false;
  constructor(
    private httpservice: HttpClient,
    private SpinnerService: NgxSpinnerService,
    public router: Router,
    public toster: ToasterService,
    private AuthorizationService: AuthorizationService,
    private toast: ToastrService,
    private appConfigService: AppConfigService
  ) {}
  ngOnInit() {
    this.AuthorizationService.clearLocalStroage();
    //check if credentials persist in localStorage then fill it in form --naresh
    this.credentilFromLocalSt();
  }

  runFocus() {
    this.credentials = false;
  }
  loginUser() {
    // console.log(this.holdCredential);
    this.credentials = false;
    if (
      this.holdCredential.username == "" ||
      this.holdCredential.password == ""
    ) {
      this.credentials = true;
      return;
    }
    var headers = { journeyId: "1", userId: "" };
    headers.userId = this.holdCredential.username;
    this.SpinnerService.show();
    this.httpservice
      .post<any>(
        window['config'].API_ENDPOINT_AUTH + "v1/login",
        this.holdCredential,
        {
          headers: headers,
          observe: "response"
        }
      )
      .subscribe(
        data => {
          let token = data.headers.get("authorization");
          this.loginCreate = data;
          sessionStorage.setItem("access-token", token);
          this.loginCreate = data;
          this.AuthorizationService.setUserDetails({
            userId: this.holdCredential.username,
            token: token
          });
          this.AuthorizationService.getPermi(this.holdCredential.username);

          // handle if user checked rememberMe -- naresh

          this.rememberMe ? this.rememberme() : "";
        },
        error => {
          let ob = ErrorConstants.validateException(error.error);
          this.toast.warning(ob.message, ob.code);
          this.SpinnerService.hide();
        }
      );
  }


  // strore credentials in localStorage
  rememberme() {
    //encr credential
    const u = this.AuthorizationService.encreptIt(this.holdCredential.username);

    localStorage.setItem(
      "RememberMe",
      JSON.stringify({
        catchX: u
      })
    );
  }

  credentilFromLocalSt() {
    let remMe = JSON.parse(localStorage.getItem("RememberMe"));
    if (remMe !== null) {
      this.holdCredential.username = this.AuthorizationService.dencreptIt(
        remMe.catchX
      );
    }
  }
}
