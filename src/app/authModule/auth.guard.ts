import {
  CanActivate,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthorizationService } from '../core/services/authorization.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor( private router: Router, private AuthorizationService:AuthorizationService) {}
  canActivate(  ) {
      if(!!sessionStorage.getItem('access-token')){
        return true
      }else{
        this.AuthorizationService.logout();
        return false
      }
  }
}
