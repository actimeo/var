import {Component, Directive, Input, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from './../../services/pg_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from '../../services/alerts';

import {FocusDirective} from './../../directives/focus';

@Component({
  selector: 'mainmenu-add',
  styles: [`
	     `],
  templateUrl: './app/components/mainmenu_add/mainmenu_add.html',
  providers: [],
  directives: [BUTTON_DIRECTIVES, FocusDirective],
})
export class MainmenuAdd {
  @Input('mse_id') mse_id: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();

  menuname: any;
  getting_name: boolean;
  menuname_focused: boolean;

  constructor(
      private _pgService: PgService, private i18n: I18nService,
      private alerts: AlertsService) {
    this.getting_name = false;
    this.menuname_focused = false;
  }

  onAddMenu() {
    this.getting_name = true;
    this.menuname_focused = true;
    // set false to be able to set it to true again
    setTimeout(() => { this.menuname_focused = false; });
  }

  cancelAddMenu() {
    this.getting_name = false;
    this.menuname = '';
  }

  doAddMenu() {
    console.log("do add menu: " + this.menuname);

    this._pgService.pgcall('portal', 'mainmenu_add', {
	prm_mse_id: this.mse_id, 
	prm_name: this.menuname
    })
        .then(new_mme_id => {
          this.onadded.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_added'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_adding_mainmenu'));
        });
    this.cancelAddMenu();
  }
}
