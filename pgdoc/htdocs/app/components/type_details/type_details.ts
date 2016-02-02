import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from 'angular2/router';

@Component({
    selector: 'type-details-cmp',
    template: `<h2>Type {{schema}}.{{id}}</h2>
	`
})
export class TypeDetailsCmp {
    schema: string;
    id: string;
    
    constructor(params: RouteParams) {
	this.schema = params.get('schema');
	this.id = params.get('id');
    }
}
