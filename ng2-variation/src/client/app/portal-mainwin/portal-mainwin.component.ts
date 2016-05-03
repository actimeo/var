import {Input, Component} from 'angular2/core';

import {CollapseDirective, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {MainSectionComponent} from '../main-section/index';
import {MainViewComponent} from '../main-view/index';

@Component({
  selector: 'portal-mainwin',
  styleUrls: ['app///portal-mainwin/portal-mainwin.component.css'],
  templateUrl: 'app///portal-mainwin/portal-mainwin.component.html',
  providers: [],
  directives: [
    //    Mainsection, MainsectionAdd, Mainview,
    MainSectionComponent, MainViewComponent,
    CollapseDirective, ACCORDION_DIRECTIVES,
    I18nDirective],
})
export class PortalMainwinComponent {
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
