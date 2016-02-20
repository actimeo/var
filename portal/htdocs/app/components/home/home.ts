import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import { ACCORDION_DIRECTIVES, DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import {Collapse} from 'ng2-bootstrap/ng2-bootstrap';

import {UserService} from '../../services/user';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'home-cmp',
    styles: [`
	     .portal-main { margin-top: 60px; }
	     #leftbar { width: 240px; }
	     `],
    templateUrl: './app/components/home/home.html',
    providers: [UserService],
    directives: [Collapse, ACCORDION_DIRECTIVES, DROPDOWN_DIRECTIVES]
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

    onPortalSelected() {
    }
}
