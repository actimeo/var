import {Component, ViewChild} from 'angular2/core';
import {RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';
import {SchemasListCmp} from './components/schemas_list/schemas_list';
import {SchemaDetailsCmp} from './components/schema_details/schema_details';
import {TableDetailsCmp} from './components/table_details/table_details';

@RouteConfig([
  new Route({path: '/table/:id', component: TableDetailsCmp, name: 'TableDetails'}),
  new Route({path: '/type/:id', component: SchemasListCmp, name: 'TypeDetails'}),
  new Route({path: '/function/:id', component: SchemasListCmp, name: 'FunctionDetails'}),
])

@Component({
    selector: 'pgdoc-app',
    template: `
	<h1>Pgdoc</h1>
	<schemas-list-cmp (onselected)="schemaSelected($event)"></schemas-list-cmp>
	<schema-details-cmp schema="" #schemaDetails></schema-details-cmp>
	<router-outlet></router-outlet>
	`,
    directives: [SchemasListCmp, SchemaDetailsCmp, ROUTER_DIRECTIVES]
})
export class PgdocApp {
    @ViewChild('schemaDetails') schemaDetails;

    schemaSelected(event) {
	console.log(event);
	this.schemaDetails.setSchema(event);
    }
}
