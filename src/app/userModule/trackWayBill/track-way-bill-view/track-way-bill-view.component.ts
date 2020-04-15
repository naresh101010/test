import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-way-bill-view',
  templateUrl: './track-way-bill-view.component.html',
  styleUrls: ['./track-way-bill-view.component.css']
})
export class TrackWayBillViewComponent implements OnInit {

  constructor() { }
  
  searchDrop = false;

  ngOnInit() {
    debugger
    this.searchDropArea();
    
  }
  searchDropArea() {
    debugger
    this.searchDrop = !this.searchDrop;
  }



}
