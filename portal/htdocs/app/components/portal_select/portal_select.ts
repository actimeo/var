import {Component, Input, Output, EventEmitter} from 'angular2/core';

import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from './../../services/alerts';

import {FocusDirective} from './../../directives/focus';

@Component({
    selector: 'portal-select',
    styles: [`
	     .getname { margin-left: 4px; }
	     `],
    templateUrl: './app/components/portal_select/portal_select.html',
    providers: [PortalService],
    directives: [DROPDOWN_DIRECTIVES, FocusDirective]
})
export class PortalSelect {

    static OP_NONE = 0;
    static OP_ADD = 1;
    static OP_RENAME = 2;
    
    @Output() onselected: EventEmitter<string> = new EventEmitter();

    portals: any;
    selected_portal: any;
    selected_portal_name: string;
    portalname: any;
    getting_name: boolean;
    portalname_focused: boolean;
    current_operation: number;

    constructor(private _portalService: PortalService,
		private i18n: I18nService,
		private alerts: AlertsService
	       ) {
	this.unselectPortal();
	this.getting_name = false;
	this.portalname_focused = false;
	this.current_operation = PortalSelect.OP_NONE;
    }
    
    ngOnInit() {	    
	this.reloadPortals(null);
    }

    unselectPortal() {
	this.selected_portal = null;
	this.selected_portal_name = this.i18n.t("portal.select_a_portal");	
	this.onselected.emit(null);
    }
    
    // Reload portals and select the specified one (or none if null)
    reloadPortals(selected_por_id) {
	this._portalService.listPortals().then(data => {	    
	    this.portals = data;
	    if (selected_por_id !== null) {
		var p = this.portals.filter(d => d.por_id == selected_por_id);
		if (p.length == 1)
		    this.onPortalSelected(p[0]);
	    }
	}).catch(err => {
	    console.log("err "+err);
	});
    }

    // A portal is selected in the list
    onPortalSelected(p) {
	this.selected_portal = p;
	this.selected_portal_name = p.por_name;
	this.onselected.emit(p.por_id);
    }

    // "Add portal" entry is selected in the list
    onAddPortal() {
	this.getting_name = true;
	this.portalname_focused = true;
	this.current_operation = PortalSelect.OP_ADD;
	// set false to be able to set it to true again
	setTimeout(() => {this.portalname_focused = false;});
    }

    // The "Rename portal" entry is selected in the list
    onRenamePortal() {
	this.getting_name = true;
	this.portalname_focused = true;
	this.current_operation = PortalSelect.OP_RENAME;
	// set false to be able to set it to true again
	setTimeout(() => {this.portalname_focused = false;});
    }

    // The "Delete portal" entry is selected in the list
    onDeletePortal() {
	this._portalService.deletePortal(this.selected_portal.por_id).then(data => {
	    this.unselectPortal();
	    this.reloadPortals(null);
	    this.alerts.success(this.i18n.t('portal.alerts.portal_deleted'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_portal'));
	});	
    }

    onCopyPortal() {
    }

    // name input is cancelled
    cancelOperation() {
	this.getting_name = false;
 	this.portalname = '';
	this.current_operation = PortalSelect.OP_NONE;
    }

    // name input is validated
    doOperation () {
	if (this.current_operation == PortalSelect.OP_ADD)
	    this.doAddPortal();
	else if (this.current_operation == PortalSelect.OP_RENAME)
	    this.doRenamePortal();
    }
    
    // The Add portal form is submitted. Let save the portal
    doAddPortal() {
	this._portalService.addPortal(this.portalname).then(new_por_id => {
	    this.reloadPortals(new_por_id);
	    this.alerts.success(this.i18n.t('portal.alerts.portal_added'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_adding_portal'));
	});	
	this.cancelOperation();
    }

    doRenamePortal() {
	this._portalService.renamePortal(this.selected_portal.por_id, this.portalname).then(data => {
	    this.reloadPortals(this.selected_portal.por_id);
	    this.alerts.success(this.i18n.t('portal.alerts.portal_renamed'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_portal'));
	});	
	this.cancelOperation();
    }

}
