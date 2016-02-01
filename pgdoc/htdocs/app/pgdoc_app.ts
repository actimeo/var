import {Component} from 'angular2/core';
import {SchemasListCmp} from './components/schemas_list/schemas_list';

@Component({
    selector: 'pgdoc-app',
    template: `
	<h1>Pgdoc</h1>
	<schemas-list-cmp></schemas-list-cmp>
	`,
    directives: [SchemasListCmp]
})
export class PgdocApp {

    
}
