import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from 'angular2/router';

@Component({
    selector: 'function-details-cmp',
    template: `<h2>Function {{schema}}.{{id}}</h2>
	`
})
export class FunctionDetailsCmp {
    schema: string;
    id: string;
    
    constructor(params: RouteParams) {
	this.schema = params.get('schema');
	this.id = params.get('id');
    }
}
