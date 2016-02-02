import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from 'angular2/router';

@Component({
    selector: 'type-details-cmp',
    template: `Type {{id}}
	`
})
export class TypeDetailsCmp {
    id: string;
    
    constructor(params: RouteParams) {
	this.id = params.get('id');
    }
}
