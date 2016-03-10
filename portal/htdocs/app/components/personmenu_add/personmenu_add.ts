import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  Inject,
  ElementRef
} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from '../../services/alerts';

import {FocusDirective} from './../../directives/focus';

@Component({
  selector : 'personmenu-add',
  styles : [ `
	     ` ],
  templateUrl : './app/components/personmenu_add/personmenu_add.html',
  providers : [ PortalService ],
  directives : [ BUTTON_DIRECTIVES, FocusDirective ],
})
export class PersonmenuAdd {

  @Input('pse_id') pse_id: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();

  menuname: any;
  getting_name: boolean;
  menuname_focused: boolean;

  constructor(private _portalService: PortalService, private i18n: I18nService,
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

    this._portalService.addPersonmenu(this.pse_id, this.menuname)
        .then(new_pme_id => {
          this.onadded.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personmenu_added'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(
              this.i18n.t('portal.alerts.error_adding_personmenu'));
        });
    this.cancelAddMenu();
  }
}
