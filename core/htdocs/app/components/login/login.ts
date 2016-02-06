import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from '../../services/user';
import {I18nService} from '../../services/i18n';

declare var PgProc: any;

@Component({
  selector: 'login-cmp',
  template: `
	<form (submit)="login($event, username.value, password.value)">
	<label for="username">{{i18n.t('core.username')}}</label>
	<input type="text" #username class="form-control" id="username" placeholder="{{i18n.t('core.username')}}">
	<label for="password">{{i18n.t('core.password')}}</label>
	<input type="password" #password class="form-control" id="password" placeholder="{{i18n.t('core.password')}}">
	<button type="submit">{{i18n.t('core.submit')}}</button>
	</form>
	<div [hidden]="!errormsg">{{errormsg}}</div>
	`,
    providers: [UserService]
})
export class LoginCmp {

    errormsg: string;

    // We inject the router via DI
    constructor(private _router: Router, private _userService: UserService, private i18n: I18nService) { 
    }

    login(event, username, password) {
	// This will be called when the user clicks on the Login button
	event.preventDefault();
	
	PgProc('/core/ajax/', 'login', 'user_login', { 'prm_login': username, 'prm_pwd': password })
	    .then((data) => {
		this._userService.connect(data.usr_token, username);
		this.errormsg = null;
		console.log(data);
		this._router.parent.navigateByUrl('/home');
	    })
	    .catch(error => {
		console.log(error);
		this.errormsg = this.i18n.t('core.autherror');
	    });
	
	// We call our API to log the user in. The username and password are entered by the user
    }
}
