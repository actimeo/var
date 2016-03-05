import {Input, Component} from 'angular2/core';

import { Collapse, ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PersonsectionAdd} from '../personsection_add/personsection_add';
import {Personsection} from '../personsection/personsection';
import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'portal-entity',
    styles: [`
	     #leftbar { min-height: 100%; width: 240px; border-right: 1px solid #e7e7e7; }
	     `],
    templateUrl: './app/components/portal_entity/portal_entity.html',
    providers: [PortalService],
    directives: [ Collapse, ACCORDION_DIRECTIVES, PersonsectionAdd, Personsection ],
})
export class PortalEntity {

    private _por_id: number;
    private personsections: any;

    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
	this._por_id = null;
    }

    @Input('entity') entity: string;
    @Input('por_id') set por_id(new_por_id: number) {
	console.log("por_id changed: "+new_por_id);
	this._por_id = new_por_id;
	if (new_por_id != null) {
	    this.reloadSections();
	}
    }
    
    reloadSections() {
	this._portalService.listPersonsections(this._por_id, this.entity).then(data => {
	    console.log("listPersonsections: "+data);
	    this.personsections = data;
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

    onSectionDeleted() {
	this.reloadSections();
    }
}
