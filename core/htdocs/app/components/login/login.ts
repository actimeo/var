import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

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
	`
})
export class LoginCmp {

    // We inject the router via DI
    constructor(private _router: Router) {
    }
    
    login(event, username, password) {
	// This will be called when the user clicks on the Login button
	event.preventDefault();
	
	// We call our API to log the user in. The username and password are entered by the user
	this._router.navigate(['Home']);
    }
}
