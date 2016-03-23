import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';

import {FocusDirective} from '../directives/focus/focus';

@Component({
  selector: 'mainsection-add',
  styleUrls: [],
  templateUrl: 'app/mainsection-add/mainsection-add.html',
  providers: [],
  directives: [BUTTON_DIRECTIVES, FocusDirective],
})
export class MainsectionAdd {
  @Input('porId') porId: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();

  sectionname: any;
  gettingName: boolean;
  sectionnameFocused: boolean;

  constructor(
      private pgService: PgService, private i18n: I18nService, private alerts: AlertsService) {
    this.gettingName = false;
    this.sectionnameFocused = false;
  }

  onAddSection() {
    this.gettingName = true;
    this.sectionnameFocused = true;
    // set false to be able to set it to true again
    setTimeout(() => { this.sectionnameFocused = false; });
  }

  cancelAddSection() {
    this.gettingName = false;
    this.sectionname = '';
  }

  doAddSection() {
    this.pgService
        .pgcall('portal', 'mainsection_add', {prm_por_id: this.porId, prm_name: this.sectionname})
        .then(newMseId => {
          this.onadded.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainsection_added'));
        })
        .catch(
            err => { this.alerts.danger(this.i18n.t('portal.alerts.error_adding_mainsection')); });
    this.cancelAddSection();
  }
}