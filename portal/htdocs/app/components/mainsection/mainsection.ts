import {Component, Input} from 'angular2/core';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

import {MainmenuAdd} from '../mainmenu_add/mainmenu_add';
import {Mainmenu} from '../mainmenu/mainmenu';

@Component({
    selector: 'mainsection',
    styles: [`
	     `],
    templateUrl: './app/components/mainsection/mainsection.html',
    providers: [],
    directives: [ Mainmenu, MainmenuAdd ],
})
export class Mainsection {

    @Input('mse_id') mse_id: number;

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
}
