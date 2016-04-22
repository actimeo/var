import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {NavigationService} from '../services/navigation/navigation';


@Component({
  selector: 'enum-details',
  templateUrl: 'app///enum_details/enum_details.html',
  styleUrls: ['app///enum_details/enum_details.css']
})
export class EnumDetailsCmp {

  schema: string;
  id: string;

  description: any;
  values: any;

  constructor(params: RouteParams, private pgService: PgService, private nav: NavigationService) {
    this.schema = params.get('schema');
    this.id = params.get('id');
    this.nav.currentTitle = 'Enum ' + this.schema + '.' + this.id;
  }

  ngOnInit() { this.reloadData(); }

  reloadData() {
    this.pgService.pgcall('pgdoc', 'enum_description', {prm_schema: this.schema, prm_enum: this.id})
        .then(data => { this.description = data; });

    this.pgService.pgcall('pgdoc', 'enum_values', {prm_schema: this.schema, prm_enum: this.id})
        .then(data => { this.values = data; });
  }

}
