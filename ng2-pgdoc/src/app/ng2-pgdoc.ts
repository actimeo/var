import {Component, ViewChild, Input, ApplicationRef} from 'angular2/core';
import {RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';

import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

import {NavigationService} from './services/navigation/navigation';

import {SchemasListCmp} from './schemas_list/schemas_list';
import {SchemaDetailsCmp} from './schema_details/schema_details';
import {SchemaDescriptionCmp} from './schema_description/schema_description';
import {TableDetailsCmp} from './table_details/table_details';
import {TypeDetailsCmp} from './type_details/type_details';
import {FunctionDetailsCmp} from './function_details/function_details';

@RouteConfig([
  new Route({path: '/schema/:id', component: SchemaDescriptionCmp, name: 'SchemaDesc'}),
  new Route({path: '/table/:schema/:id', component: TableDetailsCmp, name: 'TableDetails'}),
  new Route({path: '/type/:schema/:id', component: TypeDetailsCmp, name: 'TypeDetails'}),
  new Route(
      {path: '/function/:schema/:id', component: FunctionDetailsCmp, name: 'FunctionDetails'}),
])

@Component({
  selector: 'pgdoc-app',
  host: {'[class.push-menu]': 'fullPage'},
  styleUrls: ['app/ng2-pgdoc.css'],
  templateUrl: 'app/ng2-pgdoc.html',
  directives: [SchemasListCmp, SchemaDetailsCmp, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS]
})
export class PgdocApp {
  @ViewChild('schemaDetails') schemaDetails;

  static SIDE_MENU_BREAKPOINT: string = 'gt-md';

  @Input()
  fullPage: boolean = Media.hasMedia(PgdocApp.SIDE_MENU_BREAKPOINT);

  private subscription = null;

  constructor(
      public navigation: NavigationService, public media: Media, public appRef: ApplicationRef,
      private sidenav: SidenavService) {
    let query = Media.getQuery(PgdocApp.SIDE_MENU_BREAKPOINT);
    this.subscription = media.listen(query).onMatched.subscribe((mql: MediaQueryList) => {
      this.fullPage = mql.matches;
      this.appRef.tick();
    });
    navigation.currentTitle = 'Variation database';
  }

  hasMedia(breakSize: string): boolean { return Media.hasMedia(breakSize); }
  /*
      open(name:string) {
          this.sidenav.show(name);
      }
      close(name:string) {
          this.sidenav.hide(name);
      }
  */
  schemaSelected(event) { this.schemaDetails.setSchema(event); }

  showMenu(event?) { this.sidenav.show('menu'); }
}
