import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {NavigationService} from '../services/navigation/navigation';

@Component({
  selector: 'schema-description-cmp',
  styleUrls: ['app/schema_description/schema_description.css'],
  templateUrl: 'app/schema_description/schema_description.html'
})
export class SchemaDescriptionCmp {
  schema: string;

  description: any;

  constructor(params: RouteParams, private pgService: PgService, private nav: NavigationService) {
    this.schema = params.get('id');
    this.nav.currentTitle = 'Schema ' + this.schema;
  }

  ngOnInit() { this.reloadData(); }

  reloadData() {
    this.pgService.pgcall('pgdoc', 'schema_description', { prm_schema: this.schema }).then(data => {
      this.description = data;
    });
  }
}
