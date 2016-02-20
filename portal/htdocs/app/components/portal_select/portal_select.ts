import {Component} from 'angular2/core';

import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';

@Component({
    selector: 'portal-select',
    styles: [`
	     .getname { margin-left: 4px; }
	     `],
    templateUrl: './app/components/portal_select/portal_select.html',
    providers: [PortalService],
    directives: [DROPDOWN_DIRECTIVES]
})
export class PortalSelect {

    portals: any;
    selected_portal: any;
    selected_portal_name: string;
    portalname: any;
    getting_name: boolean;

    constructor(private _portalService: PortalService) {
	this.selected_portal = null;
	this.selected_portal_name = "Select a portal";
	this.getting_name = false;
    }
    
    ngOnInit() {	    
	console.log("portalSelect ngOnInit");
	this.reloadPortals();
    }

    reloadPortals() {
	this._portalService.listPortals().then(data => {	    
	    this.portals = data;
	    console.log(this.portals);
	}).catch(err => {
	    console.log("err "+err);
	});
    }

    onPortalSelected(p) {
	this.selected_portal = p;
	this.selected_portal_name = p.por_name;
	console.log("selportal: "+p);
    }

    onAddPortal() {
	console.log('getting name');
	this.getting_name = true;
    }

    onDeletePortal() {
	console.log("delete "+JSON.stringify(this.selected_portal));
	this._portalService.deletePortal(this.selected_portal.por_id).then(data => {
	    console.log("deleted");
	    this.selected_portal = null;
	    this.selected_portal_name = "Select a portal";
	    this.reloadPortals();
	}).catch(err => {
	    console.log("err "+err);
	});	
    }

    onCopyPortal() {
    }

    gotName(val) {
	console.log(this.portalname);
	this._portalService.addPortal(this.portalname).then(data => {
	    console.log("added: "+data);
	    this.reloadPortals();
	}).catch(err => {
	    console.log("err "+err);
	});	
	this.stopGettingName();
    }

    stopGettingName() {
	this.getting_name = false;
 	this.portalname = '';
    }
}
