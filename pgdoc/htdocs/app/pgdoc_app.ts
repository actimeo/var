import {Component, ViewChild} from 'angular2/core';
import {SchemasListCmp} from './components/schemas_list/schemas_list';
import {SchemaDetailsCmp} from './components/schema_details/schema_details';

@Component({
    selector: 'pgdoc-app',
    template: `
	<h1>Pgdoc</h1>
	<schemas-list-cmp (onselected)="schemaSelected($event)"></schemas-list-cmp>
	<schema-details-cmp schema="" #schemaDetails></schema-details-cmp>
	`,
    directives: [SchemasListCmp, SchemaDetailsCmp]
})
export class PgdocApp {
    @ViewChild('schemaDetails') schemaDetails;

    schemaSelected(event) {
	console.log(event);
	this.schemaDetails.setSchema(event);
    }
}
