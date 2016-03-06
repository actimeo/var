import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from './../../services/alerts';

import {PersonmenuAdd} from '../personmenu_add/personmenu_add';
import {Personmenu} from '../personmenu/personmenu';

import {FocusDirective} from './../../directives/focus';

@Component({
    selector: 'personsection',
    styles: [`
	     .section_ops { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px; }
	     `],
    templateUrl: './app/components/personsection/personsection.html',
    providers: [],
    directives: [ Personmenu, PersonmenuAdd, FocusDirective, TOOLTIP_DIRECTIVES ],
})
export class Personsection {

    @Input('section') section: any;
    @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

    private personmenus: any;
    private new_name: string;
    private viewedit: boolean;
    private sectionname_focused: boolean;
    
    constructor(private _portalService: PortalService,
		private i18n: I18nService,
		private alerts: AlertsService
	       ) {
	this.viewedit = false;
	this.sectionname_focused = false;
    }

    ngOnInit() {
	this.reloadMenus();
    }

    reloadMenus() {
	this._portalService.listPersonmenus(this.section.pse_id).then(data => {
	    console.log("listPersonmenus: "+data);
	    this.personmenus = data;
	}).catch(err => {
	    console.log("err "+err);
	});
    }

    onMenuAdded() {
	this.reloadMenus();
    }

    onMenuChange() {
	this.reloadMenus();
    }

    onDeleteSection() {
	console.log("delete "+this.section.pse_id);
	this._portalService.deletePersonsection(this.section.pse_id).then(data => {
	    this.ondelete.emit(null);
	    this.alerts.success(this.i18n.t('portal.alerts.personsection_deleted'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personsection'));
	});		    
    }

    onRenameSection() {
	this.new_name = this.section.pse_name;
	this.viewedit = true;
	this.sectionname_focused = true;
	setTimeout(() => {this.sectionname_focused = false;});	
    }

    doRename() {
	this._portalService.renamePersonsection(this.section.pse_id, this.new_name).then(data => {
	    this.onchange.emit(null);	
	    this.alerts.success(this.i18n.t('portal.alerts.personsection_renamed'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_personsection'));
	});		    	
    }

    onCancelRename() {
	this.viewedit = false;
    }
}
