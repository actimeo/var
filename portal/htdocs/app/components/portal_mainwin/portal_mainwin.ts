import {Input, Component} from 'angular2/core';

import { Collapse, ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {MainsectionAdd} from './../../components/mainsection_add/mainsection_add';
import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'portal-mainwin',
    styles: [`
	     #leftbar { min-height: 100%; width: 240px; border-right: 1px solid #e7e7e7; }
	     `],
    templateUrl: './app/components/portal_mainwin/portal_mainwin.html',
    providers: [PortalService],
    directives: [ MainsectionAdd, Collapse, ACCORDION_DIRECTIVES ],
})
export class PortalMainwin {

    private _por_id: number;
    private mainsections: any;

    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
	this._por_id = null;
    }
    
    @Input('por_id') set por_id(new_por_id: number) {
	console.log("por_id changed: "+new_por_id);
	this._por_id = new_por_id;
	if (new_por_id != null) {
	    this.reloadSections();
	}
    }

    reloadSections() {
	this._portalService.listMainsections(this._por_id).then(data => {
	    console.log("listMainsections: "+data);
	    this.mainsections = data;
	}).catch(err => {
	    console.log("err "+err);
	});		    
    }

    ngOnInit() {	
/*	this._portalService.listEntities().then(data => {
	    console.log("listEntities: "+data);
	    this.entities = data;
	}).catch(err => {
	    console.log("err "+err);
	});	*/
    }

    onSectionAdded() {
	this.reloadSections();
    }

    onDeleteSection(mse_id) {
	console.log("delete "+mse_id);
	this._portalService.deleteMainsection(mse_id).then(data => {
	    this.reloadSections();
	}).catch(err => {
	    console.log("err "+err);
	});		    
    }
}
