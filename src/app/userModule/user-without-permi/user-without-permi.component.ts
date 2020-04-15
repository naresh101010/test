import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-without-permi',
  templateUrl: './user-without-permi.component.html',
  styleUrls: ['./user-without-permi.component.css']
})
export class UserWithoutPermiComponent implements OnInit {
  hasPermission:boolean = true;
  constructor() {
    if(sessionStorage.getItem('menuNew')){
      this.hasPermission = false;
    }
   }

  ngOnInit() {
  }

}
