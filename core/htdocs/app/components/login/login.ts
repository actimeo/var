import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from '../../services/user';

@Component({
  selector: 'login-cmp',
  template: `
	<form (submit)="login($event, username.value, password.value)">
	<label for="username">Username</label>
	<input type="text" #username class="form-control" id="username" placeholder="Username">
	<label for="password">Password</label>
	<input type="password" #password class="form-control" id="password" placeholder="Password">
	<button type="submit">Submit</button>
	</form>
	<div [hidden]="!errormsg">{{errormsg}}</div>
	`,
    providers: [UserService]
})
export class LoginCmp {

    errormsg: string;

    // We inject the router via DI
    constructor(private _router: Router, private _userService: UserService) { }
    
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
		this.errormsg = 'Authentication error';
	    });
	
	// We call our API to log the user in. The username and password are entered by the user
    }
}
