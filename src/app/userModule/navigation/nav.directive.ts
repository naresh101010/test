import {
  Directive,
  ElementRef,
  Input,
  HostBinding,
  HostListener
} from "@angular/core";
@Directive({
  selector: "[openChild]"
})
export class NavDirective {
  constructor() {}

  @HostBinding("class.openMenu") isActive;
  @HostListener("click", ["$event"]) onClick() {
    this.isActive = !this.isActive;
  }
}
