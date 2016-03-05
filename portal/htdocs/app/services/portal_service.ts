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

    listEntities() {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'entity_list', { })
		.then(resolve, reject);
	});
    }

    listPortals() {
	console.log("portalService listPortals, token="+this.token);
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_list', { 'prm_token': this.token })
		.then(resolve, reject);
	});
    }

    addPortal(name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_add', { prm_token: this.token, prm_name: name })
		.then(resolve, reject);
	});	
    }

    renamePortal(id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_rename', { prm_token: this.token, prm_id: id, prm_name: name })
		.then(resolve, reject);
	});	
    }

    deletePortal(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'portal_delete', { prm_token: this.token, prm_id: id })
		.then(resolve, reject);
	});	
    }

    listMainsections(por_id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_list', { 'prm_token': this.token, 'prm_por_id': por_id })
		.then(resolve, reject);
	});
    }

    addMainsection(por_id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_add', { prm_token: this.token, prm_por_id: por_id, prm_name: name })
		.then(resolve, reject);
	});	
    }

    deleteMainsection(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_delete', { prm_token: this.token, prm_id: id })
		.then(resolve, reject);
	});	
    }

    renameMainsection(id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_rename', { prm_token: this.token, prm_id: id, prm_name: name })
		.then(resolve, reject);
	});	
    }

    listPersonsections(por_id, entity) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personsection_list', { 'prm_token': this.token, 'prm_por_id': por_id, 'prm_entity': entity })
		.then(resolve, reject);
	});
    }

    addPersonsection(por_id, entity, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personsection_add', { prm_token: this.token, prm_por_id: por_id, prm_entity: entity, prm_name: name })
		.then(resolve, reject);
	});	
    }

    deletePersonsection(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personsection_delete', { prm_token: this.token, prm_id: id })
		.then(resolve, reject);
	});	
    }

    listPersonmenus(pse_id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_list', { 'prm_token': this.token, 'prm_pse_id': pse_id })
		.then(resolve, reject);
	});
    }

    addPersonmenu(pse_id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_add', { prm_token: this.token, prm_pse_id: pse_id, prm_name: name })
		.then(resolve, reject);
	});	
    }

    deletePersonmenu(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_delete', { prm_token: this.token, prm_id: id })
		.then(resolve, reject);
	});	
    }

    renamePersonmenu(id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_rename', { prm_token: this.token, prm_id: id, prm_name: name })
		.then(resolve, reject);
	});	
    }

    listMainmenus(mse_id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainmenu_list', { 'prm_token': this.token, 'prm_mse_id': mse_id })
		.then(resolve, reject);
	});
    }

    addMainmenu(mse_id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainmenu_add', { prm_token: this.token, prm_mse_id: mse_id, prm_name: name })
		.then(resolve, reject);
	});	
    }

    deleteMainmenu(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainmenu_delete', { prm_token: this.token, prm_id: id })
		.then(resolve, reject);
	});	
    }

    renameMainmenu(id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainmenu_rename', { prm_token: this.token, prm_id: id, prm_name: name })
		.then(resolve, reject);
	});	
    }
}
