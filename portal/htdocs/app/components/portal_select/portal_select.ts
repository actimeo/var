import {Component, Directive, Input, ElementRef, Inject} from 'angular2/core';

import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

// Simple 'focus' Directive
@Directive({
    selector: '[focus]'
})
class FocusDirective {
    @Input()
    focus: boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    protected ngOnChanges() {
        this.element.nativeElement.focus();
    }
}

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

    portals: any;
    selected_portal: any;
    selected_portal_name: string;
    portalname: any;
    getting_name: boolean;
    portalname_focused: boolean;

    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
	this.unselectPortal();
	this.getting_name = false;
	this.portalname_focused = false;
    }
    
    ngOnInit() {	    
	this.reloadPortals(null);
    }

    unselectPortal() {
	this.selected_portal = null;
	this.selected_portal_name = this.i18n.t("portal.select_a_portal");	
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
    }

    // "Add portal" entry is selected in the list
    onAddPortal() {
	this.getting_name = true;
	this.portalname_focused = true;
	// set false to be able to set it to true again
	setTimeout(() => {this.portalname_focused = false;});
    }

    cancelAddPortal() {
	this.getting_name = false;
 	this.portalname = '';
    }

    // The Add portal form is submitted. Let save the portal
    doAddPortal(val) {
	this._portalService.addPortal(this.portalname).then(new_por_id => {
	    this.reloadPortals(new_por_id);
	}).catch(err => {
	    console.log("err "+err);
	});	
	this.cancelAddPortal();
    }

    // The "Delete portal" entry is selected in the list
    onDeletePortal() {
	this._portalService.deletePortal(this.selected_portal.por_id).then(data => {
	    this.unselectPortal();
	    this.reloadPortals(null);
	}).catch(err => {
	    console.log("err "+err);
	});	
    }

    onCopyPortal() {
    }

}
