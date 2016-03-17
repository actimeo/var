import {Input, Component} from 'angular2/core';

import {Collapse, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PersonsectionAdd} from '../personsection_add/personsection_add';
import {Personsection} from '../personsection/personsection';
import {PgService} from './../../services/pg_service';
import {I18nService} from '../../services/i18n';

@Component({
  selector: 'portal-entity',
  styles: [`
	     #leftbar { min-height: 100%; width: 240px; border-right: 1px solid #e7e7e7; }
	     `],
  templateUrl: './app/components/portal_entity/portal_entity.html',
  providers: [],
  directives: [Collapse, ACCORDION_DIRECTIVES, PersonsectionAdd, Personsection],
})
export class PortalEntity {
  private _por_id: number;
  private personsections: any;

  constructor(private _pgService: PgService, private i18n: I18nService) {
    this._por_id = null;
  }

  @Input('entity') entity: string;
  @Input('por_id')
  set por_id(new_por_id: number) {
    this._por_id = new_por_id;
    if (new_por_id != null) {
      this.reloadSections();
    }
  }

  reloadSections() {
    this._pgService.pgcall('portal', 'personsection_list', {
	prm_por_id: this._por_id, 
	prm_entity: this.entity})
          .then(data => {
              this.personsections = data;
          })
          .catch(err => { });
  }

  onSectionAdded() { this.reloadSections(); }

  onSectionDeleted() { this.reloadSections(); }

  onSectionChange() { this.reloadSections(); }
}
