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
		.then(resolve);
	});
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

    listMainsections(por_id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_list', { 'prm_token': this.token, 'prm_por_id': por_id })
		.then(resolve);
	});
    }

    addMainsection(por_id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_add', { prm_token: this.token, prm_por_id: por_id, prm_name: name })
		.then(resolve);
	});	
    }

    deleteMainsection(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'mainsection_delete', { prm_token: this.token, prm_id: id })
		.then(resolve);
	});	
    }

    listPersonsections(por_id, entity) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personsection_list', { 'prm_token': this.token, 'prm_por_id': por_id, 'prm_entity': entity })
		.then(resolve);
	});
    }

    addPersonsection(por_id, entity, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personsection_add', { prm_token: this.token, prm_por_id: por_id, prm_entity: entity, prm_name: name })
		.then(resolve);
	});	
    }

    deletePersonsection(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personsection_delete', { prm_token: this.token, prm_id: id })
		.then(resolve);
	});	
    }

    listPersonmenus(pse_id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_list', { 'prm_token': this.token, 'prm_pse_id': pse_id })
		.then(resolve);
	});
    }

    addPersonmenu(pse_id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_add', { prm_token: this.token, prm_pse_id: pse_id, prm_name: name })
		.then(resolve);
	});	
    }

    deletePersonmenu(id) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_delete', { prm_token: this.token, prm_id: id })
		.then(resolve);
	});	
    }

    renamePersonmenu(id, name) {
	return new Promise((resolve, reject) => {
	    PgProc('/portal/ajax/', 'portal', 'personmenu_rename', { prm_token: this.token, prm_id: id, prm_name: name })
		.then(resolve);
	});	
    }

}
