import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginCmp} from './components/login/login';
import {HomeCmp} from './components/home/home';
import {LoggedInRouterOutlet} from './components/loggedin_router_outlet/loggedin_router_outlet';
import {UserService} from './services/user';

@Component({
    selector: 'coredemo-app',
    template: `
	<loggedin-router-outlet></loggedin-router-outlet>
	`,
    directives: [LoggedInRouterOutlet],
    providers: [UserService]
})
@RouteConfig([
    {path:'/home', name: 'Home', component: HomeCmp },
    {path:'/login', name: 'Login', component: LoginCmp }   
])
export class CoredemoApp {
    
    constructor(private _router: Router, private _userService: UserService) {
	if (this._userService.isConnected())
	    this._router.navigate(['Home']);
	else
	    this._router.navigate(['Login']);
    }
}
