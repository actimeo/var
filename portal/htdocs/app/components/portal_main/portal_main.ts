import {Component} from 'angular2/core';

import { DROPDOWN_DIRECTIVES, Collapse, ACCORDION_DIRECTIVES, TAB_DIRECTIVES, Dropdown } from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';

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
    
    constructor(private _portalService: PortalService) {
    }
    
    ngOnInit() {	    
	this._portalService.listEntities().then(data => {
	    console.log("listEntities: "+data);
	}).catch(err => {
	    console.log("err "+err);
	});	
    }

}
