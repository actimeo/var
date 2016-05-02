import {Input, Component} from 'angular2/core';

import {CollapseDirective, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {PersonsectionAdd} from '../personsection-add/personsection-add';
import {Personsection} from '../personsection/personsection';
import {Personview} from '../personview/personview';

@Component({
  selector: 'portal-entity',
  styleUrls: ['app/portal-entity/portal-entity.css'],
  templateUrl: 'app/portal-entity/portal-entity.html',
  providers: [],
  directives: [
    CollapseDirective, ACCORDION_DIRECTIVES,
    PersonsectionAdd, Personsection, Personview,
    I18nDirective],
})
export class PortalEntity {
  private myPorId: number;
  private personsections: any;

  constructor(private pgService: PgService, private i18n: I18nService) { this.myPorId = null; }

  @Input('entity') entity: string;
  @Input('porId')
  set porId(newPorId: number) {
    this.myPorId = newPorId;
    if (newPorId != null) {
      this.reloadSections();
    }
  }

  reloadSections() {
    this.pgService
      .pgcall('portal', 'personsection_list', { prm_por_id: this.myPorId, prm_entity: this.entity })
      .then(data => { this.personsections = data; })
      .catch(err => { });
  }

  onSectionAdded() { this.reloadSections(); }

  onSectionDeleted() { this.reloadSections(); }

  onSectionChange() { this.reloadSections(); }
}
