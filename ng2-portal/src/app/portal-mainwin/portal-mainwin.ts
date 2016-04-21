import {Input, Component} from 'angular2/core';

import {Collapse, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {Mainsection} from '../mainsection/mainsection';
import {MainsectionAdd} from '../mainsection-add/mainsection-add';
import {Mainview} from '../mainview/mainview';


@Component({
  selector: 'portal-mainwin',
  styleUrls: ['app/portal-mainwin/portal-mainwin.css'],
  templateUrl: 'app/portal-mainwin/portal-mainwin.html',
  providers: [],
  directives: [
    Mainsection, Collapse, ACCORDION_DIRECTIVES,
    MainsectionAdd, Mainview, I18nDirective],
})
export class PortalMainwin {
  private myPorId: number;
  private mainsections: any;

  constructor(private pgService: PgService, private i18n: I18nService) { this.myPorId = null; }

  @Input('porId')
  set porId(newPorId: number) {
    this.myPorId = newPorId;
    if (newPorId != null) {
      this.reloadSections();
    }
  }

  reloadSections() {
    this.pgService.pgcall('portal', 'mainsection_list', { prm_por_id: this.myPorId })
      .then(data => { this.mainsections = data; })
      .catch(err => { });
  }

  onSectionAdded() { this.reloadSections(); }

  onSectionDeleted() { this.reloadSections(); }

  onSectionChange() { this.reloadSections(); }
}
