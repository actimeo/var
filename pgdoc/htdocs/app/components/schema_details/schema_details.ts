import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'schema-details-cmp',
    styles: [`
	     ul { list-style-type: none; padding: 0; }
	     li.tq { font-weight: bold; }
	     li.tq:not(:first-child) { margin-top: 16px; }
	     li:not(.tq) { margin-top: 8px; }
	     `],
    template: `
	<ul>
	<li [hidden]="noTables()" class="tq">Tables</li>
	<li *ngFor="#table of tables"><a href="" [routerLink]="['TableDetails', {schema: schema, id: table}]">{{table}}</a></li>
	<li [hidden]="noTypes()" class="tq">Types</li>
	<li *ngFor="#type of types"><a href="" [routerLink]="['TypeDetails', {schema: schema, id: type}]">{{type}}</a></li>
	<li [hidden]="noFunctions()" class="tq">Functions</li>
	<li *ngFor="#function of functions"><a href="" [routerLink]="['FunctionDetails', {schema: schema, id: function}]">{{function}}</a></li>
	</ul>
	`,
    providers: [PgdocService],
    directives: [RouterLink]

})
export class SchemaDetailsCmp {

    schema: string;

    tables: any;
    types: any;
    functions: any;
    _pgdocService: PgdocService;
    
    constructor(_pgdocService: PgdocService) {
	this._pgdocService = _pgdocService;
	this.schema = null;
    }

    ngOnInit() {	    
	this.reloadData();
    }

    noTables() {
	return this.tables==null || this.tables.length == 0;
    }

    noTypes() {
	return this.types==null || this.types.length == 0;
    }

    noFunctions() {
	return this.functions==null || this.functions.length == 0;
    }

    reloadData() {
	if (this.schema == null) {
	    this.tables = null;
	    this.types = null;
	    this.functions = null;
	    return;
	}
	
	this._pgdocService.schemaListTables(this.schema).then(data => {
	    this.tables = data;
	    console.log(this.tables);
	});
	this._pgdocService.schemaListTypes(this.schema).then(data => {
	    this.types = data;
	    console.log(this.types);
	});
	this._pgdocService.schemaListFunctions(this.schema).then(data => {
	    this.functions = data;
	    console.log(this.functions);
	});
    }

    setSchema(schema) {
	this.schema = schema;
	this.reloadData();
    }
}
