import { Component, HostListener } from "@angular/core";
import { AuthorizationService } from "./core/services/authorization.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private AuthorizationService:AuthorizationService) {}
  title = "app";

  //disable backspace to switch screen sate or URL - naresh
  @HostListener("document:keydown", ["$event"])
  onKeyDown(evt: KeyboardEvent) {
    if (evt.keyCode === 8 || evt.which === 8) {
      let doPrevent = true;
      const types = [
        "text",
        "password",
        "file",
        "search",
        "email",
        "number",
        "date",
        "color",
        "datetime",
        "datetime-local",
        "month",
        "range",
        "search",
        "tel",
        "time",
        "url",
        "week"
      ];
      const target = <HTMLInputElement>evt.target;
      const disabled =
        target.disabled || (<HTMLInputElement>event.target).readOnly;
      if (!disabled) {
        if (target.isContentEditable) {
          doPrevent = false;
        } else if (target.nodeName === "INPUT") {
          let type = target.type;
          if (type) {
            type = type.toLowerCase();
          }
          if (types.indexOf(type) > -1) {
            doPrevent = false;
          }
        } else if (target.nodeName === "TEXTAREA") {
          doPrevent = false;
        }
      }
      if (doPrevent) {
        evt.preventDefault();
        return false;
      }
    }
  }
  //disable backspace to switch screen sate or URL


  //handle browser forcely -- navigate to login page
  // @HostListener('window:beforeunload', [ '$event' ])
  // unloadHandler(event) {
  //    this.AuthorizationService.clearLocalStroage();
  // }
}
