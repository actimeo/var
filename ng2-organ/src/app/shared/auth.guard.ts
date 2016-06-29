import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) { }

  canActivate() {
    if (this.userService.isConnected()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
