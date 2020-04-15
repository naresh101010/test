import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { AuthorizationService } from 'src/app/core/services/authorization.service';

@Component({
  selector: 'app-repeat-child-item',
  templateUrl: './repeat-child-item.component.html',
  styleUrls: ['./repeat-child-item.component.css']
})
export class RepeatChildItemComponent implements OnInit {
  @Input() items;
  @ViewChild('childMenu', {static:false}) public childMenu;
  @Input() mainSection = "";
  @Input() subSection = "";
  constructor(private AuthorizationService:AuthorizationService) {   }
  ngOnInit() {  }

  run(v){
    console.log(v)
  }

}

