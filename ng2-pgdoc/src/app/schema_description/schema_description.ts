import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {NavigationService} from '../services/navigation/navigation';
import {Markdown} from '../markdown/markdown';
import {LocalStorageService} from '../services/local-storage/local-storage';

@Component({
  selector: 'schema-description-cmp',
  styleUrls: ['app/schema_description/schema_description.css'],
  templateUrl: 'app/schema_description/schema_description.html',
  directives: [Markdown, MATERIAL_DIRECTIVES],
  providers: [LocalStorageService]
})
export class SchemaDescriptionCmp {
  schema: string;

  description: any;
  private olddescription;
  private editing = false;
  private displayOriginal: boolean = false;

  constructor(params: RouteParams, private pgService: PgService, private nav: NavigationService,
    private locStore: LocalStorageService) {
    this.schema = params.get('id');
    this.nav.currentTitle = 'Schema ' + this.schema;
  }

  ngOnInit() {
    if (!this.reloadLocalData()) {
      this.reloadData();
    }
  }

  reloadLocalData() {
    this.description = this.locStore.getSchemaDescription(this.schema);
    return this.description;
  }

  reloadData() {
    this.pgService.pgcall('pgdoc', 'schema_description', { prm_schema: this.schema }).then(data => {
      this.description = data;
    });
  }

  startEdit() {
    this.editing = true;
    this.olddescription = this.description;
  }
  save() {
    this.editing = false;
    // save description to local
    this.locStore.setSchemaDescription(this.schema, this.description);
  }
  cancel() {
    this.editing = false;
    this.description = this.olddescription;
  }
  reset() {
    // clear description saved in local
    this.locStore.removeSchemaDescription(this.schema);
    this.reloadData();
  }

  isModified() {
    return this.locStore.schemaDescriptionExists(this.schema);
  }

  onDisplayOriginalChange(cbstate) {
    this.displayOriginal = cbstate;
    if (cbstate) {
      this.reloadData();
    } else {
      this.reloadLocalData();
    }
  }
}
