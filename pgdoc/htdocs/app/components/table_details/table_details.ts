import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'table-details-cmp',
    styles: [`
	     table { border-collapse: collapse; border: 1px solid black; }
	     th, td { padding: 4px; border: 1px solid black; }
	     `],
    template: `<h2>Table {{schema}}.{{id}}</h2>
	<div class="description">{{description}}</div>
	<h3>Columns</h3>
	<table><tr><th>#<th>Type<th>Name<th>not null<th>default<th>description</tr>
	<tr *ngFor="#column of columns">
	<td>{{column.col}}</td>
	<td>{{column.typname}}<span *ngIf="column.typlen > 0">({{column.typlen}})</span></td>
	<td>{{column.colname}}</td>
	<td><span *ngIf="column.isnotnull">X</span></td>
	<td><span *ngIf="column.hasdefault">{{column.deftext}}</span></td>
	<td>{{column.description}}</td>
	</tr>
	</table>
	`,
    providers: [PgdocService]
})
export class TableDetailsCmp {
    schema: string;
    id: string;
    _pgdocService: PgdocService;

    description: any;
    columns: any;
    
    constructor(params: RouteParams, _pgdocService: PgdocService) {
	this._pgdocService = _pgdocService;
	this.schema = params.get('schema');
	this.id = params.get('id');
    }

    ngOnInit() {	    
	this.reloadData();
    }

    reloadData() {
	this._pgdocService.tableDescription(this.schema, this.id).then(data => {
	    this.description = data;
	    console.log(this.description);
	});

	this._pgdocService.tableColumns(this.schema, this.id).then(data => {
	    this.columns = data;
	    console.log(this.columns);
	});
    }


}
