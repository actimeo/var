import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {TimerWrapper} from 'angular2/src/facade/async';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {SidenavService} from 'ng2-material/all';

@Component({
  selector: 'schema-details-cmp',
  styleUrls: ['app/schema_details/schema_details.css'],
  templateUrl: 'app/schema_details/schema_details.html',
  directives: [RouterLink]
})
export class SchemaDetailsCmp {
  schema: string;

  tables: any;
  types: any;
  enums: any;
  functions: any;

  constructor(private pgService: PgService, private sidenav: SidenavService) { this.schema = null; }

  ngOnInit() { this.reloadData(); }

  hasTables() { return this.tables != null && this.tables.length != 0; }

  hasTypes() { return this.types != null && this.types.length != 0; }

  hasEnums() { return this.enums != null && this.enums.length != 0; }

  hasFunctions() { return this.functions != null && this.functions.length != 0; }

  reloadData() {
    if (this.schema == null) {
      this.tables = null;
      this.types = null;
      this.enums = null;
      this.functions = null;
      return;
    }

    this.pgService.pgcall('pgdoc', 'schema_list_tables', {prm_schema: this.schema}).then(data => {
      this.tables = data;
    });
    this.pgService.pgcall('pgdoc', 'schema_list_types', {prm_schema: this.schema}).then(data => {
      this.types = data;
    });
    this.pgService.pgcall('pgdoc', 'schema_list_enums', {prm_schema: this.schema}).then(data => {
      this.enums = data;
    });
    this.pgService.pgcall('pgdoc', 'schema_list_functions', {prm_schema: this.schema})
        .then(data => { this.functions = data; });
  }

  setSchema(schema) {
    this.schema = schema;
    this.reloadData();
  }

  itemClick() {
    TimerWrapper.setTimeout(() => { this.sidenav.hide('menu'); }, 0);
    // this._sidenav.hide('menu');
  }
}
