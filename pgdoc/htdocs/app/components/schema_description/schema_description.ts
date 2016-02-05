import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'schema-description-cmp',
    styles: [`
	     `],
    template: `
	<md-toolbar>
	<h2 class="md-toolbar-tools">
	<span>Schema {{schema}}</span>
	</h2>
	</md-toolbar>
	<md-content layout-padding><div style="white-space: pre-wrap">{{description}}</div></md-content>
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
