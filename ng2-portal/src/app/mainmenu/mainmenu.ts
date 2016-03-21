import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';

import {FocusDirective} from '../directives/focus/focus';
import {Footertip} from '../directives/footertip/footertip';

import {MmeMovePipe} from '../pipes/mme-move/mme-move';

@Component({
  selector: 'mainmenu',
  styleUrls: [],
  templateUrl: 'app/mainmenu/mainmenu.html',
  providers: [],
  directives: [TOOLTIP_DIRECTIVES, FocusDirective, Footertip],
  pipes: [MmeMovePipe],
})
export class Mainmenu {
  viewcfg: boolean;
  viewtools: boolean;
  viewedit: boolean;
  menunameFocused: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private beforePos: string;
  private moveFocused: boolean;

  @Input('menu') menu: any;
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

  constructor(
      private pgService: PgService, private i18n: I18nService, private alerts: AlertsService) {
    this.viewcfg = true;
    this.viewtools = false;
    this.viewedit = false;
    this.menunameFocused = false;
    this.viewmove = false;
    this.moveFocused = false;
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
    this.menunameFocused = true;
    setTimeout(() => { this.menunameFocused = false; });
  }

  onCancelRename() {
    this.viewedit = false;
    this.viewtools = false;
    this.viewcfg = true;
    this.onchange.emit(null);
  }

  doRename() {
    this.pgService
        .pgcall(
            'portal', 'mainmenu_rename', {prm_id: this.menu.mme_id, prm_name: this.menu.mme_name})
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_renamed'));
        })
        .catch(
            err => { this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_mainmenu')); });
  }

  // Delete
  onDelete() {
    this.pgService.pgcall('portal', 'mainmenu_delete', {prm_id: this.menu.mme_id})
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_deleted'));
        })
        .catch(
            err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainmenu')); });
  }

  // Move
  onMove() {
    this.viewmove = true;
    this.viewtools = false;

    this.pgService.pgcall('portal', 'mainmenu_list', {prm_mse_id: this.menu.mse_id})
        .then(data => {
          this.movechoices = data;
          this.moveFocused = true;
          setTimeout(() => { this.moveFocused = false; });
          if (this.movechoices.length == 1) {
            this.alerts.info(this.i18n.t('portal.alerts.no_moving_mainmenu'));
            this.onCancelMove();
          }

        })
        .catch(err => {});
  }

  doMove() {
    this.pgService
        .pgcall(
            'portal', 'mainmenu_move_before_position',
            {prm_id: this.menu.mme_id, prm_position: this.beforePos})
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_moved'));
        })
        .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_moving_mainmenu')); });
  }

  onCancelMove() {
    this.viewmove = false;
    this.viewtools = false;
    this.viewcfg = true;
  }
}
