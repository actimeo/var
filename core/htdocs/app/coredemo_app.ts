import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginCmp} from './components/login/login';
import {HomeCmp} from './components/home/home';

@Component({
    selector: 'coredemo-app',
    template: `
	<router-outlet></router-outlet>
	`,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path:'/home', name: 'Home', component: HomeCmp },
    {path:'/login', name: 'Login', component: LoginCmp }   
])
export class CoredemoApp {
    
    constructor(private _router: Router) {
	this._router.navigate(['Login']);
    }
}
