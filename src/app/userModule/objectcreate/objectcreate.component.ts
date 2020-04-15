import { Component, OnInit, HostListener } from "@angular/core";
import { ObjectcreateService } from "./objectcreate.service";
@Component({
  selector: "app-objectcreate",
  templateUrl: "./objectcreate.component.html",
  styleUrls: ["./objectcreate.component.css"]
})
export class ObjectcreateComponent implements OnInit {
  model: any = {};

  ObjectModel:any={
        "ObjectName":"",
  };
  constructor(public objectservice: ObjectcreateService) {}
  ngOnInit() {
    this.getObj();
  }

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.ctrlKey && (event.keyCode === 83)) {
        event.preventDefault();
        let element: HTMLElement = document.getElementById('submitButton') as HTMLElement;
         element.click();
         }
    }

  createObject() {
    this.objectservice.createObj(this.ObjectModel).subscribe(
      (response: any) => {
        // console.log(response);
      },
      error => {
        // console.log(error);
      }
    );
  }
  getObj() {
    this.objectservice.getUsers().subscribe((users: any) => {
      // console.log(users),
      error => console.log(error);
    });
  }
  onPut() {
    this.objectservice.update().subscribe(
        (users: any) => {
          console.log(users),
        (error:any) => {
          console.log(error);
        }
    });
  }
//Get module DropDown List value
  getmoduleList(){
    this.objectservice.moduleList().subscribe((users: any) => {
      console.log(users),
      error => console.log(error);
    });
  }
//End module DDL
//Get Section DropDown List value
  getscetionList(){
    this.objectservice.scetionList().subscribe((users: any) => {
      console.log(users),
      error => console.log(error);
    });
  }
//End Section DDL
//Add Attributes
  addatributes(){

  }
//end Add Attribute
//Add Section
  addSection(){

  }
//end Add Section
//Add Section Element
addSectionElement(){

}
//end Add Section Element
}
