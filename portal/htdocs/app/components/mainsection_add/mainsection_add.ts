import {Component, Directive, Input, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from '../../services/alerts';

import {FocusDirective} from './../../directives/focus';

@Component({
  selector: 'mainsection-add',
  styles: [`
	     `],
  templateUrl: './app/components/mainsection_add/mainsection_add.html',
  providers: [PortalService],
  directives: [BUTTON_DIRECTIVES, FocusDirective],
})
export class MainsectionAdd {
  @Input('por_id') por_id: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();

  sectionname: any;
  getting_name: boolean;
  sectionname_focused: boolean;

  constructor(
      private _portalService: PortalService, private i18n: I18nService,
      private alerts: AlertsService) {
    this.getting_name = false;
    this.sectionname_focused = false;
  }

  onAddSection() {
    this.getting_name = true;
    this.sectionname_focused = true;
    // set false to be able to set it to true again
    setTimeout(() => { this.sectionname_focused = false; });
  }

  cancelAddSection() {
    this.getting_name = false;
    this.sectionname = '';
  }

  doAddSection() {
    console.log("do add section: " + this.sectionname);

    this._portalService.addMainsection(this.por_id, this.sectionname)
        .then(new_mse_id => {
          this.onadded.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainsection_added'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_adding_mainsection'));
        });
    this.cancelAddSection();
  }
}
