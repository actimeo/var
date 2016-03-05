import {Component, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';

import {Collapse} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalSelect} from '../../components/portal_select/portal_select';
import {PortalMain} from '../../components/portal_main/portal_main';
import {Alerts} from '../../components/alerts/alerts';

import {UserService} from '../../services/user';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'home-cmp',
    styles: [`
	     .portal-main { margin-top: 60px; }
	     .alerts { position: fixed; top: 60px; right: 16px; }
	     `],
    templateUrl: './app/components/home/home.html',
    providers: [UserService],
    directives: [PortalSelect, PortalMain, Alerts]
})
export class HomeCmp {
    @ViewChild('portalmain') portalmain;

    // Here we define this component's instance variables
    // They're accessible from the template
    constructor(private _router: Router, private _userService: UserService, private i18n: I18nService) {
    }

    ngOnInit() {
    }
    
    getUser() {
	return this._userService.getLogin();
    }

    logout() {
	this._userService.disconnect();
	this._router.parent.navigateByUrl('/login');
    }
    
    onPortalSelected(por_id) {
	console.log("selected: "+por_id);
	this.portalmain.setPortalId(por_id);
    }
}
