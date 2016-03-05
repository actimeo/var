import {Component,Directive, Input, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

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
    selector: 'personmenu',
    styles: [`
	     `],
    templateUrl: './app/components/personmenu/personmenu.html',
    providers: [],
    directives: [TOOLTIP_DIRECTIVES, FocusDirective],
})
export class Personmenu {

    viewcfg: boolean;
    viewtools: boolean;
    viewedit: boolean;
    menuname_focused: boolean;

    @Input('menu') menu: any;
    @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
	this.viewcfg = true;
	this.viewtools = false;
	this.viewedit = false;
	this.menuname_focused = false;
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
	this.menuname_focused = true;
	setTimeout(() => {this.menuname_focused = false;});	
    }

    onCancelRename() {
	this.viewedit = false;
	this.viewtools = false;
	this.viewcfg = true;
	this.onchange.emit(null);	
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