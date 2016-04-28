import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {LoggedinRouterOutlet}
from './loggedin-router-outlet.directive';

import {LoginComponent} from './login/index';
import {HomeComponent} from './home/index';

@Component({
  selector: 'ng2-variation-app',
  providers: [],
  templateUrl: 'app///ng2-variation.html',
  directives: [ROUTER_DIRECTIVES, LoggedinRouterOutlet],
  pipes: []
})
@RouteConfig([
  { path: '/home', name: 'Home', component: HomeComponent },
  { path: '/login', name: 'Login', component: LoginComponent }
]) export class Ng2VariationApp {
  constructor(private router: Router, private userService: UserService) {
    if (this.userService.isConnected()) {
      this.router.navigate(['Home']);
    } else {
    }
    this.router.navigate(['Login']);
  }
}
