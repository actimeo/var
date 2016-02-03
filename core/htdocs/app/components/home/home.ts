import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from '../../services/user';

@Component({
    selector: 'home-cmp',
    template: `
	<div class="home">
	<h1>Logged in as {{getUser()}}</h1>
	<p><a (click)="logout()">Logout</a></p>
	</div>
	`,
    providers: [UserService]
})
export class HomeCmp {

    // Here we define this component's instance variables
    // They're accessible from the template
    constructor(private _router: Router, private _userService: UserService) {
    }

    getUser() {
	return this._userService.getLogin();
    }

    logout() {
	this._userService.disconnect();
	this._router.parent.navigateByUrl('/login');
    }
}
