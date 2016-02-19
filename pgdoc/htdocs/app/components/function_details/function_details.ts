import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgdocService} from './../../services/pgdoc_service';
import {NavigationService} from './../../services/navigation';

@Component({
    selector: 'function-details-cmp',
    styles: [`
	     .arg { margin-left: 16px; }
	     .argtype { color: #009688; }
	     table { border-collapse: collapse; border: 1px solid black; }
	     th, td { padding: 4px; border: 1px solid black; }
	     `],
    template: `
	<md-content layout-padding>

	<div *ngIf="details?.description">
	<h3>Description</h3>
	<div style="white-space: pre-wrap">{{details?.description}}</div>
	</div>

	<div *ngIf="details">
	  <h3>Synopsis</h3>
	  <pre><span class="argtype"><span *ngIf="details.retset">setof </span>{{details.rettype_name}}</span> {{id}} (<div *ngIf="args"><div *ngFor="#arg of args; #last=last" class="arg"><span class="argtype">{{arg.argtype}}</span> {{arg.argname}}<span *ngIf="!last">,</span></div></div>)</pre>
        </div>
	
	<div *ngIf="retColumns && retColumns.length">
	  <h3>Return value</h3>
  	  <table><tr><th>#<th>Type<th>Name<th>description</tr>
	    <tr *ngFor="#column of retColumns">
	      <td>{{column.col}}</td>
	      <td>{{column.typname}}<span *ngIf="column.typlen > 0">({{column.typlen}})</span></td>
	      <td>{{column.colname}}</td>
	      <td>{{column.description}}</td>
	    </tr>
	  </table>
	</div>

	<div *ngIf="details?.src">
	  <h3>Sources ({{details.lang}})</h3>
	<pre style="white-space: pre-wrap; background-color: #222; color: #fff; border-radius: 8px;" layout-padding>{{details.src}}</pre>
        </div>
	</md-content>
	`,
    providers: [PgdocService]
})
export class FunctionDetailsCmp {
    schema: string;
    id: string;
    _pgdocService: PgdocService;

    details: any;
    args: any;
    retColumns: any;

    constructor(
	params: RouteParams, 
	_pgdocService: PgdocService,
	private nav: NavigationService
) {
	this._pgdocService = _pgdocService;
	this.schema = params.get('schema');
	this.id = params.get('id');
	this.nav.currentTitle = 'Function '+this.schema+'.'+this.id;
    }

    ngOnInit() {	    
	this.reloadData();
    }

    reloadData() {
	this._pgdocService.functionDetails(this.schema, this.id).then(data => {
	    this.details = data;
	    console.log(this.details);

	    this._pgdocService.typeColumns(this.details.rettype_schema, this.details.rettype_name).then(data => {
		this.retColumns = data;
		console.log("retColumn: "+this.retColumns);
	    });
	});

	this._pgdocService.functionArguments(this.schema, this.id).then(data => {
	    this.args = data;
	    console.log(this.args);
	});
    }
}
