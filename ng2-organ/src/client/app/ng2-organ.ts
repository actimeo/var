import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {LoggedinRouterOutlet}
from './loggedin-router-outlet/loggedin-router-outlet.directive';

import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';

@Component({
  selector: 'ng2-organ-app',
  providers: [],
  templateUrl: 'app///ng2-organ.html',
  directives: [ROUTER_DIRECTIVES, LoggedinRouterOutlet],
  pipes: []
})
@RouteConfig([
  { path: '/home', name: 'Home', component: HomeComponent },
  { path: '/login', name: 'Login', component: LoginComponent }
]) export class Ng2OrganApp {
  constructor(private router: Router, private userService: UserService) {
    if (this.userService.isConnected()) {
      this.router.navigate(['Home']);
    } else {
    }
    this.router.navigate(['Login']);
  }
}
