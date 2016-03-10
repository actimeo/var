import {Component, Directive, Input, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from '../../services/alerts';

import {FocusDirective} from './../../directives/focus';

import {PmeMovePipe} from './../../pipes/pme_move';

@Component({
  selector: 'personmenu',
  styles: [`
	     `],
  templateUrl: './app/components/personmenu/personmenu.html',
  providers: [],
  directives: [TOOLTIP_DIRECTIVES, FocusDirective],
  pipes: [PmeMovePipe],
})
export class Personmenu {
  viewcfg: boolean;
  viewtools: boolean;
  viewedit: boolean;
  menuname_focused: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private before_pos: string;
  private move_focused: boolean;

  @Input('menu') menu: any;
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

  constructor(
      private _portalService: PortalService, private i18n: I18nService,
      private alerts: AlertsService) {
    this.viewcfg = true;
    this.viewtools = false;
    this.viewedit = false;
    this.menuname_focused = false;
    this.viewmove = false;
    this.move_focused = false;
  }

  doViewtools(v) {
    if (v) {
      this.viewtools = true;
      this.viewcfg = false;
    } else {
      this.viewtools = false;
      this.viewcfg = true;
    }
  }

  // Rename
  onRename() {
    this.viewedit = true;
    this.viewtools = false;
    this.menuname_focused = true;
    setTimeout(() => { this.menuname_focused = false; });
  }

  onCancelRename() {
    this.viewedit = false;
    this.viewtools = false;
    this.viewcfg = true;
    this.onchange.emit(null);
  }

  doRename() {
    this._portalService.renamePersonmenu(this.menu.pme_id, this.menu.pme_name)
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personmenu_renamed'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_personmenu'));
        });
  }

  // Delete
  onDelete() {
    this._portalService.deletePersonmenu(this.menu.pme_id)
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personmenu_deleted'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personmenu'));
        });
  }

  // Move
  onMove() {
    this.viewmove = true;
    this.viewtools = false;

    this._portalService.listPersonmenus(this.menu.pse_id)
        .then(data => {
          this.movechoices = data;
          this.move_focused = true;
          setTimeout(() => { this.move_focused = false; });
          if (this.movechoices.length == 1) {
            this.alerts.info(this.i18n.t('portal.alerts.no_moving_personmenu'));
            this.onCancelMove();
          }

        })
        .catch(err => { console.log("err " + err); });
  }

  doMove() {
    console.log("before pos: " + this.before_pos);
    this._portalService.movePersonmenu(this.menu.pme_id, this.before_pos)
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personmenu_moved'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_moving_personmenu'));
        });
  }

  onCancelMove() {
    this.viewmove = false;
    this.viewtools = false;
    this.viewcfg = true;
  }
}
