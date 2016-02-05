import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'schema-details-cmp',
    styles: [`
	     md-list-item { cursor: pointer; }
	     `],
    template: `
	<div [hidden]="!schema">
	<md-list>

	<md-list-item class="md-1-line" [routerLink]="['SchemaDesc', { id: schema }]">
	  <i md-icon class="material-icons">description</i>
	  <div class="md-list-item-text">Description</div>
	</md-list-item>

	<div [hidden]="noTables()"><md-subheader class="md-subheader">Tables</md-subheader></div>
	<md-list-item class="md-1-line" *ngFor="#table of tables" md-ink [routerLink]="['TableDetails', { schema: schema, id: table }]">
	  <i md-icon class="material-icons">storage</i>
	  <div class="md-list-item-text">{{table}}</div>
	</md-list-item>

	<div [hidden]="noTypes()"><md-subheader class="md-subheader">Types</md-subheader></div>
	<md-list-item class="md-1-line" *ngFor="#type of types" md-ink [routerLink]="['TypeDetails', { schema: schema, id: type }]">
	  <i md-icon class="material-icons">list</i>
	  <div class="md-list-item-text">{{type}}</div>
	</md-list-item>

	<div [hidden]="noFunctions()"><md-subheader class="md-subheader">Functions</md-subheader></div>
	<md-list-item class="md-1-line" *ngFor="#function of functions" [routerLink]="['FunctionDetails', { schema: schema, id: function }]">
	  <i md-icon class="material-icons">functions</i>
	  <div class="md-list-item-text">{{function}}</div>
	</md-list-item>
	</md-list>
	</div>
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
