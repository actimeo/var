import {Component} from 'angular2/core';

import { DROPDOWN_DIRECTIVES, Collapse, ACCORDION_DIRECTIVES, TAB_DIRECTIVES, Dropdown } from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

@Component({
    selector: 'portal-main',
    styles: [`
	     #leftbar { width: 240px; }
	     `],
    templateUrl: './app/components/portal_main/portal_main.html',
    providers: [PortalService],
    directives: [ DROPDOWN_DIRECTIVES, TAB_DIRECTIVES, Collapse, ACCORDION_DIRECTIVES ]
})
export class PortalMain {
    
    private entities: any;
    
    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
    }
    
    ngOnInit() {	    
	this._portalService.listEntities().then(data => {
	    console.log("listEntities: "+data);
	    this.entities = data;
	}).catch(err => {
	    console.log("err "+err);
	});	
    }

}
