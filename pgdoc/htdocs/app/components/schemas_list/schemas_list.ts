import {Component} from 'angular2/core';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'schemas-list-cmp',
    template: `
	<select>
	<option value="">(select a schema)</option>
	<option *ngFor="#schema of schemas" value="{{schema}}">{{schema}}</option>
	</select>
	`,
    providers: [PgdocService]

})
export class SchemasListCmp {

    schemas: any;
    _pgdocService: PgdocService;
    
    constructor(_pgdocService: PgdocService) {
	this._pgdocService = _pgdocService;
    }

    ngOnInit() {	    
	this._pgdocService.listSchemas().then(data => {
	    this.schemas = data;
	    console.log(this.schemas);
	});
    }

}
