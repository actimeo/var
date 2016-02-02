import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'schema-description-cmp',
    styles: [`
	     `],
    template: `
        <h2>Schema {{schema}}</h2>
	<div style="white-space: pre-wrap">{{description}}</div>
	`,
    providers: [PgdocService]

})
export class SchemaDescriptionCmp {

    schema: string;
    _pgdocService: PgdocService;

    description: any;
    
    constructor(params: RouteParams, _pgdocService: PgdocService) {
	this._pgdocService = _pgdocService;
	this.schema = params.get('id');
    }

    ngOnInit() {	    
	this.reloadData();
    }

    reloadData() {
	
	this._pgdocService.schemaDescription(this.schema).then(data => {
	    this.description = data;
	    console.log(this.description);
	});
    }

}
