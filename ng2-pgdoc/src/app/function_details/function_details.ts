import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgService} from '../services/pg-service/pg-service';
import {NavigationService} from '../services/navigation/navigation';

@Component({
  selector: 'function-details-cmp',
  styleUrls: ['app/function_details/function_details.css'],
  templateUrl: 'app/function_details/function_details.html',
  providers: [PgService]
})
export class FunctionDetailsCmp {
  schema: string;
  id: string;

  details: any;
  args: any;
  retColumns: any;

  constructor(params: RouteParams, private pgService: PgService, private nav: NavigationService) {
    this.schema = params.get('schema');
    this.id = params.get('id');
    this.nav.currentTitle = 'Function ' + this.schema + '.' + this.id;
  }

  ngOnInit() { this.reloadData(); }

  reloadData() {
    this.pgService
        .pgcall('pgdoc', 'function_details', {prm_schema: this.schema, prm_function: this.id})
        .then(data => {
          this.details = data;

          this.pgService
              .pgcall(
                  'pgdoc', 'type_columns',
                  {prm_schema: this.details.rettype_schema, prm_type: this.details.rettype_name})
              .then(data2 => {
                this.retColumns = data2;
              });
        });

    this.pgService
        .pgcall('pgdoc', 'function_arguments', {prm_schema: this.schema, prm_function: this.id})
        .then(data => {
          this.args = data;
        });
  }
}
