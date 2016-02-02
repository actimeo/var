import {Component, ViewChild} from 'angular2/core';
import {RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';
import {SchemasListCmp} from './components/schemas_list/schemas_list';
import {SchemaDetailsCmp} from './components/schema_details/schema_details';
import {TableDetailsCmp} from './components/table_details/table_details';
import {TypeDetailsCmp} from './components/type_details/type_details';
import {FunctionDetailsCmp} from './components/function_details/function_details';

@RouteConfig([
  new Route({path: '/table/:id', component: TableDetailsCmp, name: 'TableDetails'}),
  new Route({path: '/type/:id', component: TypeDetailsCmp, name: 'TypeDetails'}),
  new Route({path: '/function/:id', component: FunctionDetailsCmp, name: 'FunctionDetails'}),
])

@Component({
    selector: 'pgdoc-app',
    styles: [`
	     nav {
		 width: 200px;
		 float: left;
	     }
	     main {
		 margin-left: 210px;
		 background-color: #eee;
	     }
	     `],
    template: `
	<h1>Pgdoc</h1>
	<nav>
	<schemas-list-cmp (onselected)="schemaSelected($event)"></schemas-list-cmp>
	<schema-details-cmp #schemaDetails></schema-details-cmp>
	</nav>
	<main><router-outlet></router-outlet></main>
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
