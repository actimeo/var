import {Component,Directive, Input, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from './../../services/alerts';

import {MainmenuAdd} from '../mainmenu_add/mainmenu_add';
import {Mainmenu} from '../mainmenu/mainmenu';

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
    selector: 'mainsection',
    styles: [`
	     .section_ops { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bott	     `],
    templateUrl: './app/components/mainsection/mainsection.html',
    providers: [],
    directives: [ Mainmenu, MainmenuAdd, FocusDirective ],
})
export class Mainsection {

    @Input('section') section: any;
    @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

    private mainmenus: any;
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

    onRenameSection() {
	this.viewedit = true;
	this.sectionname_focused = true;
	setTimeout(() => {this.sectionname_focused = false;});	
    }

    doRename() {
	this._portalService.renameMainsection(this.section.mse_id, this.section.mse_name).then(data => {
	    this.onchange.emit(null);	
	    this.alerts.success(this.i18n.t('portal.alerts.mainsection_renamed'));
	}).catch(err => {
	    console.log("err "+err);
	    this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_mainsection'));
	});		    	
    }

    onCancelRename() {
	this.viewedit = false;
	this.onchange.emit(null);	
    }
}
