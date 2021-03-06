import {Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {LoginCmp} from './login/login';
import {HomeCmp} from './home/home';
import {LoggedinRouterOutlet} from './loggedin-router-outlet/loggedin-router-outlet';


@Component({
  selector: 'app',
  templateUrl: 'app/ng2-portal.html',
  directives: [LoggedinRouterOutlet],
  providers: []
})
@RouteConfig([
  {path: '/home', name: 'Home', component: HomeCmp},
  {path: '/login', name: 'Login', component: LoginCmp}
])
export class Ng2PortalApp {
  constructor(private router: Router, private userService: UserService) {
    if (this.userService.isConnected()) {
      this.router.navigate(['Home']);
    } else {
    }
    this.router.navigate(['Login']);
  }
}
