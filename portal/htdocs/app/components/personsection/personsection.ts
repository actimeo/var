import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

import {PersonmenuAdd} from '../personmenu_add/personmenu_add';
import {Personmenu} from '../personmenu/personmenu';

@Component({
    selector: 'personsection',
    styles: [`
	     .section_ops { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px; }
	     `],
    templateUrl: './app/components/personsection/personsection.html',
    providers: [],
    directives: [ Personmenu, PersonmenuAdd ],
})
export class Personsection {

    @Input('pse_id') pse_id: number;
    @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();

    private personmenus: any;
    
    constructor(private _portalService: PortalService,
		private i18n: I18nService
	       ) {
    }

    ngOnInit() {
	this.reloadMenus();
    }

    reloadMenus() {
	this._portalService.listPersonmenus(this.pse_id).then(data => {
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
	console.log("delete "+this.pse_id);
	this._portalService.deletePersonsection(this.pse_id).then(data => {
	    this.ondelete.emit(null);
	}).catch(err => {
	    console.log("err "+err);
	});		    
    }
}
