import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';

import {FocusDirective} from '../directives/focus/focus';

@Component({
  selector: 'mainmenu-add',
  styleUrls: [],
  templateUrl: 'app/mainmenu-add/mainmenu-add.html',
  providers: [],
  directives: [BUTTON_DIRECTIVES, FocusDirective],
})
export class MainmenuAdd {
  @Input('mseId') mseId: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();

  menuname: any;
  gettingName: boolean;
  menunameFocused: boolean;

  constructor(
      private pgService: PgService, private i18n: I18nService, private alerts: AlertsService) {
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
        .pgcall('portal', 'mainmenu_add', {prm_mse_id: this.mseId, prm_name: this.menuname})
        .then(newMmeId => {
          this.onadded.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_added'));
        })
        .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_adding_mainmenu')); });
    this.cancelAddMenu();
  }
}
