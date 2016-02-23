import {Input, Component} from 'angular2/core';

import { Collapse, ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'portal-entity',
    styles: [`
	     #leftbar { min-height: 100%; width: 240px; border-right: 1px solid #e7e7e7; }
	     `],
    templateUrl: './app/components/portal_entity/portal_entity.html',
    providers: [PortalService],
    directives: [ Collapse, ACCORDION_DIRECTIVES ],
})
export class PortalEntity {
    @Input('entity') entity: string;
    @Input('por_id') por_id: number;

    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
    }
    
    ngOnInit() {	    
/*	this._portalService.listEntities().then(data => {
	    console.log("listEntities: "+data);
	    this.entities = data;
	}).catch(err => {
	    console.log("err "+err);
	});	*/
    }

}
