import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from 'angular2/router';

@Component({
    selector: 'function-details-cmp',
    template: `Function {{id}}
	`
})
export class FunctionDetailsCmp {
    id: string;
    
    constructor(params: RouteParams) {
	this.id = params.get('id');
    }
}
