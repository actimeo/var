import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';
import {MainmenuAdd} from '../mainmenu-add/mainmenu-add';
import {Mainmenu} from '../mainmenu/mainmenu';

import {FocusDirective} from '../directives/focus/focus';
import {Footertip} from '../directives/footertip/footertip';

import {MseMovePipe} from '../pipes/mse-move/mse-move';

@Component({
  selector: 'mainsection',
  styleUrls: ['app/mainsection/mainsection.css'],
  templateUrl: 'app/mainsection/mainsection.html',
  providers: [],
  directives: [FocusDirective, TOOLTIP_DIRECTIVES, Mainmenu, MainmenuAdd, Footertip],
  pipes: [MseMovePipe]
})
export class Mainsection {
  @Input('section') section: any;
  @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

  private mainmenus: any;
  private newName: string;
  private viewedit: boolean;
  private sectionnameFocused: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private beforePos: string;
  private moveFocused: boolean;

  constructor(
      private pgService: PgService, private i18n: I18nService, private alerts: AlertsService) {
    this.viewedit = false;
    this.sectionnameFocused = false;
    this.viewmove = false;
    this.moveFocused = false;
  }

  ngOnInit() { this.reloadMenus(); }

  reloadMenus() {
    this.pgService.pgcall('portal', 'mainmenu_list', {prm_mse_id: this.section.mse_id})
        .then(data => { this.mainmenus = data; })
        .catch(err => {});
  }

  onMenuAdded() { this.reloadMenus(); }

  onMenuChange() { this.reloadMenus(); }

  // Delete
  onDeleteSection() {
    this.pgService.pgcall('portal', 'mainsection_delete', {prm_id: this.section.mse_id})
        .then(data => {
          this.ondelete.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainsection_deleted'));
        })
        .catch(err => {
          this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainsection'));
        });
  }

  // Rename
  onRenameSection() {
    this.newName = this.section.mse_name;
    this.viewedit = true;
    this.sectionnameFocused = true;
    setTimeout(() => { this.sectionnameFocused = false; });
  }

  doRename() {
    this.pgService
        .pgcall(
            'portal', 'mainsection_rename', {prm_id: this.section.mse_id, prm_name: this.newName})
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainsection_renamed'));
        })
        .catch(err => {
          this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_mainsection'));
        });
  }

  onCancelRename() { this.viewedit = false; }

  // Move
  onMoveSection() {
    this.viewmove = true;

    this.pgService.pgcall('portal', 'mainsection_list', {prm_por_id: this.section.por_id})
        .then(data => {
          this.movechoices = data;
          this.moveFocused = true;
          setTimeout(() => { this.moveFocused = false; });
          if (this.movechoices.length == 1) {
            this.alerts.info(this.i18n.t('portal.alerts.no_moving_mainsection'));
            this.viewmove = false;
          }

        })
        .catch(err => {});
  }

  doMove() {
    this.pgService
        .pgcall(
            'portal', 'mainsection_move_before_position',
            {prm_id: this.section.mse_id, prm_position: this.beforePos})
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.mainsection_moved'));
        })
        .catch(
            err => { this.alerts.danger(this.i18n.t('portal.alerts.error_moving_mainsection')); });
  }

  onCancelMove() { this.viewmove = false; }
}
