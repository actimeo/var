import {Component, ViewChild, Input, ApplicationRef} from 'angular2/core';
import {RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';

import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {NavigationService} from './services/navigation/navigation';

import {SchemasListCmp} from './schemas_list/schemas_list';
import {SchemaDetailsCmp} from './schema_details/schema_details';
import {SchemaDescriptionCmp} from './schema_description/schema_description';
import {TableDetailsCmp} from './table_details/table_details';
import {TypeDetailsCmp} from './type_details/type_details';
import {EnumDetailsCmp} from './enum_details/enum_details';
import {FunctionDetailsCmp} from './function_details/function_details';

declare var saveAs;
declare var JSZip;

@RouteConfig([
  new Route({ path: '/schema/:id', component: SchemaDescriptionCmp, name: 'SchemaDesc' }),
  new Route({ path: '/table/:schema/:id', component: TableDetailsCmp, name: 'TableDetails' }),
  new Route({ path: '/type/:schema/:id', component: TypeDetailsCmp, name: 'TypeDetails' }),
  new Route({ path: '/enum/:schema/:id', component: EnumDetailsCmp, name: 'EnumDetails' }),
  new Route(
    { path: '/function/:schema/:id', component: FunctionDetailsCmp, name: 'FunctionDetails' }),
])

@Component({
  selector: 'pgdoc-app',
  host: { '[class.push-menu]': 'fullPage' },
  styleUrls: ['app/ng2-pgdoc.css'],
  templateUrl: 'app/ng2-pgdoc.html',
  directives: [SchemasListCmp, SchemaDetailsCmp, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS]
})
export class PgdocApp {
  @ViewChild('schemaDetails') schemaDetails;

  static SIDE_MENU_BREAKPOINT: string = 'gt-md';

  @Input()
  fullPage: boolean = this.media.hasMedia(PgdocApp.SIDE_MENU_BREAKPOINT);

  private subscription = null;

  constructor(
    public navigation: NavigationService, public media: Media, public appRef: ApplicationRef,
    private sidenav: SidenavService, private pgService: PgService) {
    let query = Media.getQuery(PgdocApp.SIDE_MENU_BREAKPOINT);
    this.subscription = media.listen(query).onMatched.subscribe((mql: MediaQueryList) => {
      this.fullPage = mql.matches;
      this.appRef.tick();
    });
    navigation.currentTitle = 'Variation database';
  }

  hasMedia(breakSize: string): boolean { return this.media.hasMedia(breakSize); }
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

  download() {
    this.pgService
      .pgcall('pgdoc', 'comments_get_all', {
        'prm_ignore_schema': ['pg%', 'information_schema', 'public']
      })
      .then((data: any[]) => {
        var arrs = data.reduce((prev: {}, next) => {
          if (next.typ == 'schema') {
            prev[next.name] = 'COMMENT ON SCHEMA ' + next.name + ' IS \''
              + next.comment.replace(/'/g, "''") + '\';\n\n';
            return prev;
          } else if (next.typ == 'table') {
            if (next.comment) {
              prev[next.schema] += 'COMMENT ON TABLE ' + next.schema + '.' + next.name + ' IS \''
                + next.comment.replace(/'/g, "''") + '\';\n\n';
            }
            return prev;
          } else if (next.typ == 'enum' /*|| next.typ == 'type'*/) {
            if (next.comment) {
              prev[next.schema] += 'COMMENT ON TYPE ' + next.schema + '.' + next.name + ' IS \''
                + next.comment.replace(/'/g, "''") + '\';\n\n';
            }
            return prev;
          } else if (next.typ == 'column') {
            if (next.comment) {
              prev[next.schema] +=
                'COMMENT ON COLUMN ' + next.schema + '.' + next.name + '.' + next.subname + ' IS \''
                + next.comment.replace(/'/g, "''") + '\';\n\n';
            }
            return prev;
          } else {
            return prev;
          }
        }, {});

        new Promise((resolve, reject) => {
          var zip = new JSZip();
          var c = 0;
          var keys = Object.keys(arrs);
          keys.forEach(key => {
            var value = arrs[key];
            zip.file(key + '/sql/comments.sql', value);
            if (++c == keys.length) {
              resolve(zip);
            }
          });
        }).then((zip: any) => {
          zip.generateAsync({ type: 'blob' })
            .then(function (content) {
              console.log(content);
              saveAs(content, 'comments.zip');
            });
        });
      });
  }
}
