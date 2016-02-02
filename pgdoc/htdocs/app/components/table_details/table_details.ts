import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from 'angular2/router';

@Component({
    selector: 'table-details-cmp',
    template: `Table {{id}}
	`
})
export class TableDetailsCmp {
    id: string;
    
    constructor(params: RouteParams) {
	this.id = params.get('id');
    }
}
