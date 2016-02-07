import {Component, ViewChild, Input, ApplicationRef} from 'angular2/core';
import {RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';

import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

import {SchemasListCmp} from './components/schemas_list/schemas_list';
import {SchemaDetailsCmp} from './components/schema_details/schema_details';
import {SchemaDescriptionCmp} from './components/schema_description/schema_description';
import {TableDetailsCmp} from './components/table_details/table_details';
import {TypeDetailsCmp} from './components/type_details/type_details';
import {FunctionDetailsCmp} from './components/function_details/function_details';

@RouteConfig([
  new Route({path: '/schema/:id', component: SchemaDescriptionCmp, name: 'SchemaDesc'}),
  new Route({path: '/table/:schema/:id', component: TableDetailsCmp, name: 'TableDetails'}),
  new Route({path: '/type/:schema/:id', component: TypeDetailsCmp, name: 'TypeDetails'}),
  new Route({path: '/function/:schema/:id', component: FunctionDetailsCmp, name: 'FunctionDetails'}),
])

@Component({
    selector: 'pgdoc-app',
    host: {
	'[class.push-menu]': 'fullPage'
    },
    styles: [`
	     nav {
		 width: 200px;
		 float: left;
	     }
	     main {
	     }
	     `],
    templateUrl: './app/pgdoc_app.html',
    directives: [SchemasListCmp, SchemaDetailsCmp, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
    providers: [SidenavService, MATERIAL_PROVIDERS]
})
export class PgdocApp {
    @ViewChild('schemaDetails') schemaDetails;

    static SIDE_MENU_BREAKPOINT: string = 'gt-md';

    @Input()
    fullPage: boolean = Media.hasMedia(PgdocApp.SIDE_MENU_BREAKPOINT);

    private _subscription = null;

    constructor(
	public sidenav:SidenavService,
        public media: Media,
        public appRef: ApplicationRef
    ) {
	let query = Media.getQuery(PgdocApp.SIDE_MENU_BREAKPOINT);
	this._subscription = media.listen(query).onMatched.subscribe((mql: MediaQueryList) => {
	    this.fullPage = mql.matches;
	    this.appRef.tick();
	});
	
    }

    hasMedia(breakSize:string):boolean {
	return Media.hasMedia(breakSize);
    }

    open(name:string) {
	this.sidenav.show(name);
    }
    close(name:string) {
	this.sidenav.hide(name);
    }

    schemaSelected(event) {
	console.log(event);
	this.schemaDetails.setSchema(event);
    }
}
