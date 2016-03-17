import {Component, Directive, Input, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from './../../services/pg_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from '../../services/alerts';

import {FocusDirective} from './../../directives/focus';

import {MmeMovePipe} from './../../pipes/mme_move';

@Component({
  selector: 'mainmenu',
  styles: [`
	     `],
  templateUrl: './app/components/mainmenu/mainmenu.html',
  providers: [],
  directives: [TOOLTIP_DIRECTIVES, FocusDirective],
  pipes: [MmeMovePipe],
})
export class Mainmenu {
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
      private _pgService: PgService, private i18n: I18nService,
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
    this._pgService.pgcall('portal', 'mainmenu_rename', {
	prm_id: this.menu.mme_id, 
	prm_name: this.menu.mme_name
    })
          .then(data => {
              this.onchange.emit(null);
              this.alerts.success(this.i18n.t('portal.alerts.mainmenu_renamed'));
          })
          .catch(err => {
              console.log("err " + err);
              this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_mainmenu'));
          });
  }

  // Delete
  onDelete() {
    this._pgService.pgcall('portal', 'mainmenu_delete', {
	prm_id: this.menu.mme_id
    })
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_deleted'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainmenu'));
        });
  }

  // Move
  onMove() {
    this.viewmove = true;
    this.viewtools = false;

    this._pgService.pgcall('portal', 'mainmenu_list', {
	prm_mse_id: this.menu.mse_id
    })
        .then(data => {
          this.movechoices = data;
          this.move_focused = true;
          setTimeout(() => { this.move_focused = false; });
          if (this.movechoices.length == 1) {
            this.alerts.info(this.i18n.t('portal.alerts.no_moving_mainmenu'));
            this.onCancelMove();
          }

        })
        .catch(err => { console.log("err " + err); });
  }

  doMove() {
    console.log("before pos: " + this.before_pos);
    this._pgService.pgcall('portal', 'mainmenu_move_before_position', {
	prm_id: this.menu.mme_id, 
	prm_position: this.before_pos
    })
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainmenu_moved'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_moving_mainmenu'));
        });
  }

  onCancelMove() {
    this.viewmove = false;
    this.viewtools = false;
    this.viewcfg = true;
  }
}
