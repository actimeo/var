import {Input, Component} from 'angular2/core';

import {Collapse, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {Mainsection} from './../../components/mainsection/mainsection';
import {MainsectionAdd} from './../../components/mainsection_add/mainsection_add';
import {PgService} from '../../services/pg_service';
import {I18nService} from '../../services/i18n';

@Component({
  selector: 'portal-mainwin',
  styles: [`
	     #leftbar { min-height: 100%; width: 240px; border-right: 1px solid #e7e7e7; }
om: 15px; }
	     `],
  templateUrl: './app/components/portal_mainwin/portal_mainwin.html',
  providers: [],
  directives: [Mainsection, MainsectionAdd, Collapse, ACCORDION_DIRECTIVES],
})
export class PortalMainwin {
  private _por_id: number;
  private mainsections: any;

  constructor(private _pgService: PgService, private i18n: I18nService) {
    this._por_id = null;
  }

  @Input('por_id')
  set por_id(new_por_id: number) {
    this._por_id = new_por_id;
    if (new_por_id != null) {
      this.reloadSections();
    }
  }

  reloadSections() {
      this._pgService.pgcall('portal', 'mainsection_list', {
	  prm_por_id: this._por_id
      })
          .then(data => {
              this.mainsections = data;
          })
          .catch(err => { });
  }

  onSectionAdded() { this.reloadSections(); }

  onSectionDeleted() { this.reloadSections(); }

  onSectionChange() { this.reloadSections(); }
}
