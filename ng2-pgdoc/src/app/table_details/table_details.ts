import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgService} from '../services/pg-service/pg-service';
import {NavigationService} from '../services/navigation/navigation';

@Component({
  selector: 'table-details-cmp',
  styleUrls: ['app/table_details/table_details.css'],
  templateUrl: 'app/table_details/table_details.html',
  providers: [PgService]
})
export class TableDetailsCmp {
  schema: string;
  id: string;

  description: any;
  columns: any;

  constructor(params: RouteParams, private pgService: PgService, private nav: NavigationService) {
    this.schema = params.get('schema');
    this.id = params.get('id');
    this.nav.currentTitle = 'Table ' + this.schema + '.' + this.id;
  }

  ngOnInit() { this.reloadData(); }

  reloadData() {
    this.pgService
        .pgcall('pgdoc', 'table_description', {prm_schema: this.schema, prm_table: this.id})
        .then(data => { this.description = data; });

    this.pgService.pgcall('pgdoc', 'table_columns', {prm_schema: this.schema, prm_table: this.id})
        .then(data => { this.columns = data; });
  }
}
