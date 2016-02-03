import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'home-cmp',
    template: `
	<div class="home">
	<h1>Logged in</h1>
	<p><a (click)="logout()">Logout</a></p>
	</div>
	`
})
export class HomeCmp {

    // Here we define this component's instance variables
    // They're accessible from the template
    constructor(private _router: Router) {
    }

    logout() {
	this._router.navigate(['Login']);
    }
}
