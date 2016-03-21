import {Input, Component} from 'angular2/core';

import {Collapse, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PersonsectionAdd} from '../personsection-add/personsection-add';
import {Personsection} from '../personsection/personsection';
import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';

@Component({
  selector: 'portal-entity',
  styleUrls: ['app/portal-entity/portal-entity.css'],
  templateUrl: 'app/portal-entity/portal-entity.html',
  providers: [],
  directives: [Collapse, ACCORDION_DIRECTIVES, PersonsectionAdd, Personsection],
})
export class PortalEntity {
  private myPorId: number;
  private personsections: any;

  constructor(private pgService: PgService, private i18n: I18nService) {
    this.myPorId = null;
  }

  @Input('entity') entity: string;
  @Input('porId')
  set porId(newPorId: number) {
    this.myPorId = newPorId;
    if (newPorId != null) {
      this.reloadSections();
    }
  }

  reloadSections() {
    this.pgService.pgcall('portal', 'personsection_list', {
        prm_por_id: this.myPorId,
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
