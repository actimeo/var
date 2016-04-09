import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgService} from '../services/pg-service/pg-service';
import {NavigationService} from '../services/navigation/navigation';

@Component({
  selector: 'type-details-cmp',
  styleUrls: ['app/type_details/type_details.css'],
  templateUrl: 'app/type_details/type_details.html',
  providers: [PgService]
})
export class TypeDetailsCmp {
  schema: string;
  id: string;

  description: any;
  columns: any;
  functionsReturningType: any;

  constructor(params: RouteParams, private pgService: PgService, private nav: NavigationService) {
    this.schema = params.get('schema');
    this.id = params.get('id');
    this.nav.currentTitle = 'Type ' + this.schema + '.' + this.id;
  }

  ngOnInit() { this.reloadData(); }

  reloadData() {
    this.pgService.pgcall('pgdoc', 'type_description', {prm_schema: this.schema, prm_type: this.id})
        .then(data => { this.description = data; });

    this.pgService.pgcall('pgdoc', 'type_columns', {prm_schema: this.schema, prm_type: this.id})
        .then(data => { this.columns = data; });

    this.pgService
        .pgcall('pgdoc', 'functions_returning_type', {prm_schema: this.schema, prm_type: this.id})
        .then(data => { this.functionsReturningType = data; });
  }
}
