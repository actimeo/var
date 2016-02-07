import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';
import {NavigationService} from './../../services/navigation';

@Component({
    selector: 'schema-description-cmp',
    styles: [`
	     `],
    template: `
	<md-content layout-padding><h3>Description</h3><div style="white-space: pre-wrap">{{description}}</div></md-content>
	`,
    providers: [PgdocService]

})
export class SchemaDescriptionCmp {

    schema: string;
    _pgdocService: PgdocService;

    description: any;
    
    constructor(
	params: RouteParams, 
	_pgdocService: PgdocService,
	private nav: NavigationService
    ) {
	this._pgdocService = _pgdocService;
	this.schema = params.get('id');
	this.nav.currentTitle = 'Schema '+this.schema;
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
