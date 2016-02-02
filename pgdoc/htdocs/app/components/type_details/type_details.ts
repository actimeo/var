import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';

@Component({
    selector: 'type-details-cmp',
    styles: [`
	     table { border-collapse: collapse; border: 1px solid black; }
	     th, td { padding: 4px; border: 1px solid black; }
	     `],
    template: `<h2>Type {{schema}}.{{id}}</h2>
	<div class="description">{{description}}</div>
	<h3>Columns</h3>
	<table><tr><th>#<th>Type<th>Name<th>description</tr>
	<tr *ngFor="#column of columns">
	<td>{{column.col}}</td>
	<td>{{column.typname}}<span *ngIf="column.typlen > 0">({{column.typlen}})</span></td>
	<td>{{column.colname}}</td>
	<td>{{column.description}}</td>
	</tr>
	</table>
	<div *ngIf="functionsReturningType">
	<h3>Functions returning this type</h3>
	<ul>
	<li *ngFor="#function of functionsReturningType">{{function}}</li>
	</ul>
	</div>
	`,
    providers: [PgdocService]
})
export class TypeDetailsCmp {
    schema: string;
    id: string;
    _pgdocService: PgdocService;

    description: any;
    columns: any;
    functionsReturningType: any;

    constructor(params: RouteParams, _pgdocService: PgdocService) {
	this._pgdocService = _pgdocService;
	this.schema = params.get('schema');
	this.id = params.get('id');
    }

    ngOnInit() {	    
	this.reloadData();
    }

    reloadData() {
	this._pgdocService.typeDescription(this.schema, this.id).then(data => {
	    this.description = data;
	    console.log(this.description);
	});

	this._pgdocService.typeColumns(this.schema, this.id).then(data => {
	    this.columns = data;
	    console.log(this.columns);
	});

	this._pgdocService.functionsReturningType(this.schema, this.id).then(data => {
	    this.functionsReturningType = data;
	    console.log(this.functionsReturningType);
	});
    }

}
