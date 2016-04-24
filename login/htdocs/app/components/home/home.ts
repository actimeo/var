import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from '../../services/user';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'home-cmp',
    template: `
	<div class="home">
	<h1>{{i18n.t('auth.logged_in_as')}} {{getUser()}}</h1>
	<p><a (click)="logout()">Logout</a></p>
	</div>
	`,
    providers: [UserService]
})
export class HomeCmp {

    // Here we define this component's instance variables
    // They're accessible from the template
    constructor(private _router: Router, private _userService: UserService, private i18n: I18nService) {
    }

    getUser() {
	return this._userService.getLogin();
    }

    logout() {
	this._userService.disconnect();
	this._router.parent.navigateByUrl('/login');
    }
}
