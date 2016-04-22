import {Component, Output, EventEmitter} from 'angular2/core';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'schemas-list-cmp',
  templateUrl: 'app/schemas_list/schemas_list.html'
})
export class SchemasListCmp {
  schemas: any;

  @Output() onselected: EventEmitter<string> = new EventEmitter();

  constructor(private pgService: PgService) {}

  ngOnInit() {
    this.pgService.pgcall('pgdoc', 'list_schemas', {'prm_ignore': ['pg%', 'information_schema']})
        .then(data => { this.schemas = data; });
  }

  onSelectChange(event) { this.onselected.emit(event.target.value); }
}
