import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';
import {SelectedMenus} from '../services/selected-menus/selected-menus';

import {FocusDirective} from '../directives/focus/focus';

@Component({
  selector: 'personmenu-add',
  styleUrls: [],
  templateUrl: 'app/personmenu-add/personmenu-add.html',
  providers: [],
  directives: [BUTTON_DIRECTIVES, FocusDirective],
})
export class PersonmenuAdd {
  @Input('pse_id') pseId: number;
  @Input('entity') entity: string;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();

  menuname: any;
  gettingName: boolean;
  menunameFocused: boolean;

  constructor(
      private pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
      private selectedMenus: SelectedMenus) {
    this.gettingName = false;
    this.menunameFocused = false;
  }

  onAddMenu() {
    this.gettingName = true;
    this.menunameFocused = true;
    // set false to be able to set it to true again
    setTimeout(() => { this.menunameFocused = false; });
  }

  cancelAddMenu() {
    this.gettingName = false;
    this.menuname = '';
  }

  doAddMenu() {
    this.pgService
        .pgcall('portal', 'personmenu_add', {prm_pse_id: this.pseId, prm_name: this.menuname})
        .then((newPmeId: number) => {
          this.onadded.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personmenu_added'));
          this.selectedMenus.setPersonmenu(this.entity, newPmeId);
        })
        .catch(
            err => { this.alerts.danger(this.i18n.t('portal.alerts.error_adding_personmenu')); });
    this.cancelAddMenu();
  }
}
