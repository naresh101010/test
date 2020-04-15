import { Component, OnInit, ElementRef,Inject } from "@angular/core";
import { AuthorizationService } from "src/app/core/services/authorization.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"]
})
export class NavigationComponent implements OnInit {
  opened = true;
  menuFlg = true;
  entitylist = [];
  navItems: any;
  user = "";
  defltBranch: "";
  searchDrop = false;
  user_without_permi = false;
  tstUser:boolean = false;
  constructor(
    private AuthorizationService: AuthorizationService,public dialog: MatDialog,
    private element: ElementRef<HTMLElement>
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(trackwayBill, {
      panelClass: 'my-panel',
      width: '125rem',minHeight: '32rem',
      position: {
        top: '6.5rem',
        left: '28rem'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnInit() {
    if(sessionStorage.getItem("all")){
      this.tstUser = false    
    this.defltBranch = JSON.parse(
      sessionStorage.getItem("all")
    ).data.responseData.user.defatultBranchName;
    this.user = JSON.parse(
      sessionStorage.getItem("all")
    ).data.responseData.user.username;
    this.navItems = this.AuthorizationService.getMenu();
  }else{
    this.tstUser = true;
  }
    
debugger
    if(!sessionStorage.getItem('permissions')){ //if permission not persist
      this.user_without_permi = true;
    }   

    this.searchDropArea();
    
  }

  logout() {
    this.AuthorizationService.logout();
  }

  searchDropArea(){
    this.searchDrop = !this.searchDrop;
  }
}

@Component({
  selector: 'Track-WayBill',
  templateUrl: 'trackwaybill.component.html',
  styleUrls: ['navigation.component.css']
})
export class trackwayBill {

  constructor(
    public dialogRef: MatDialogRef<trackwayBill>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
