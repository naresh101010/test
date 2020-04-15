import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-refresh-componet',
  templateUrl: './refresh-componet.component.html',
  styleUrls: ['./refresh-componet.component.css']
})
export class RefreshComponetComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    this.router.navigate(['/login'])
  }

}
