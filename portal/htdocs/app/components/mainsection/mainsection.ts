import {Component,Directive, Input, Output, EventEmitter} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from './../../services/alerts';

import {MainmenuAdd} from '../mainmenu_add/mainmenu_add';
import {Mainmenu} from '../mainmenu/mainmenu';

import {FocusDirective} from './../../directives/focus';

import {MseMovePipe} from './../../pipes/mse_move';

@Component({
    selector: 'mainsection',
    styles: [`
	     .section_ops { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px; }
	     `],
    templateUrl: './app/components/mainsection/mainsection.html',
    providers: [],
    directives: [ Mainmenu, MainmenuAdd, FocusDirective, TOOLTIP_DIRECTIVES ],
    pipes: [MseMovePipe]
})
export class Mainsection {

    @Input('section') section: any;
    @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

    private mainmenus: any;
    private new_name: string;
    private viewedit: boolean;
    private sectionname_focused: boolean;
    private viewmove: boolean;
    private movechoices: any;
    private before_pos: string;
    private move_focused: boolean;

    constructor(private _portalService: PortalService,
		private i18n: I18nService,
		private alerts: AlertsService
	       ) {
	this.viewedit = false;
	this.sectionname_focused = false;
	this.viewmove = false;
	this.move_focused = false;
    }

    ngOnInit() {
	this.reloadMenus();
    }

    reloadMenus() {
	this._portalService.listMainmenus(this.section.mse_id).then(data => {
	    console.log("listMainmenus: "+data);
	    this.mainmenus = data;
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

    // Delete
    onDeleteSection() {
	console.log("delete "+this.section.mse_id);
	this._portalService.deleteMainsection(this.section.mse_id).then(data => {
	    this.ondelete.emit(null);		    
	    this.alerts.success(this.i18n.t('portal.alerts.mainsection_deleted'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainsection'));
	});		    
    }

    // Rename
    onRenameSection() {
	this.new_name = this.section.mse_name;
	this.viewedit = true;
	this.sectionname_focused = true;
	setTimeout(() => {this.sectionname_focused = false;});	
    }

    doRename() {
	this._portalService.renameMainsection(this.section.mse_id, this.new_name).then(data => {
	    this.onchange.emit(null);	
	    this.alerts.success(this.i18n.t('portal.alerts.mainsection_renamed'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_mainsection'));
	});		    	
    }

    onCancelRename() {
	this.viewedit = false;
    }

    // Move
    onMoveSection() {
	this.viewmove = true;
	
	this._portalService.listMainsections(this.section.por_id).then(data => {
	    this.movechoices = data;
	    this.move_focused = true;
	    setTimeout(() => {this.move_focused = false;});	
	    if (this.movechoices.length == 1) {
		this.alerts.info(this.i18n.t('portal.alerts.no_moving_mainsection'));
		this.viewmove = false;
	    }
		
	}).catch(err => {
	    console.log("err "+err);
	});		    	
    }

    doMove() {
	console.log("before pos: "+this.before_pos);
	this._portalService.moveMainsection(this.section.mse_id, this.before_pos).then(data => {
	    this.onchange.emit(null);
	    this.alerts.success(this.i18n.t('portal.alerts.mainsection_moved'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_moving_mainsection'));
	});		    	
	
    }
    
    onCancelMove() {
	this.viewmove = false;
    }
}
