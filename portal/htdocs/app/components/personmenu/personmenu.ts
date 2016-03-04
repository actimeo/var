import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'personmenu',
    styles: [`
	     `],
    templateUrl: './app/components/personmenu/personmenu.html',
    providers: [],
    directives: [TOOLTIP_DIRECTIVES],
})
export class Personmenu {

    viewcfg: boolean;
    viewtools: boolean;
    viewedit: boolean;

    @Input('menu') menu: any;
    @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
	this.viewcfg = true;
	this.viewtools = false;
	this.viewedit = false;
    }

    doViewtools(v) {
	if (v) {
	    this.viewtools = true;
	    this.viewcfg = false;
	} else {
	    this.viewtools = false;
	    this.viewcfg = true;
	}
    }

    onRename() {
	this.viewedit = true;
	this.viewtools = false;
    }

    onCancelRename() {
	this.viewedit = false;
	this.viewtools = false;
	this.viewcfg = true;
    }

    doRename() {
	this._portalService.renamePersonmenu(this.menu.pme_id, this.menu.pme_name).then(data => {
	    this.onchange.emit(null);	
	}).catch(err => {
	    console.log("err "+err);
	});		    
    }
    
    onDelete() {
	this._portalService.deletePersonmenu(this.menu.pme_id).then(data => {
	    this.onchange.emit(null);	
	}).catch(err => {
	    console.log("err "+err);
	});		    
    }
}
