import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

import {MainmenuAdd} from '../mainmenu_add/mainmenu_add';
import {Mainmenu} from '../mainmenu/mainmenu';

@Component({
    selector: 'mainsection',
    styles: [`
	     .section_ops { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bott	     `],
    templateUrl: './app/components/mainsection/mainsection.html',
    providers: [],
    directives: [ Mainmenu, MainmenuAdd ],
})
export class Mainsection {

    @Input('mse_id') mse_id: number;
    @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();

    private mainmenus: any;
    
    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
    }

    ngOnInit() {
	this.reloadMenus();
    }

    reloadMenus() {
	this._portalService.listMainmenus(this.mse_id).then(data => {
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
	console.log("delete "+this.mse_id);
	this._portalService.deleteMainsection(this.mse_id).then(data => {
	    this.ondelete.emit(null);		    
	}).catch(err => {
	    console.log("err "+err);
	});		    
    }
}
