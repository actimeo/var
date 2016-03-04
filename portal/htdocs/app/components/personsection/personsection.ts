import {Component, Input} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

import {PersonmenuAdd} from '../personmenu_add/personmenu_add';

@Component({
    selector: 'personsection',
    styles: [`
	     `],
    templateUrl: './app/components/personsection/personsection.html',
    providers: [],
    directives: [ PersonmenuAdd ],
})
export class Personsection {

    @Input('pse_id') pse_id: number;

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
}
