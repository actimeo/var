import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {UserService} from './../services/user';

declare var PgProc: any;

@Injectable()
export class PortalService {

    token: string;

    constructor(
	private _http: Http, 
	_user: UserService) {
	this.token = _user.getToken();
    }

    listPortals() {
	console.log("portalService listPortals, token="+this.token);
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_list', { 'prm_token': this.token })
		.then(resolve);
	});
    }

    addPortal(name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_add', { prm_token: this.token, prm_name: name })
		.then(resolve);
	});	
    }

    deletePortal(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_delete', { prm_token: this.token, prm_id: id })
		.then(resolve);
	});	
    }
}
