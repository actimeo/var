import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';
import {SelectedMenus} from '../services/selected-menus/selected-menus';

import {FocusDirective} from '../directives/focus/focus';
import {Footertip} from '../directives/footertip/footertip';

import {PmeMovePipe} from '../pipes/pme-move/pme-move';

@Component({
  selector: 'personmenu',
  styleUrls: ['app/personmenu/personmenu.css'],
  templateUrl: 'app/personmenu/personmenu.html',
  providers: [],
  directives: [TOOLTIP_DIRECTIVES, FocusDirective, Footertip],
  pipes: [PmeMovePipe],
})
export class Personmenu {
  viewcfg: boolean;
  viewtools: boolean;
  viewedit: boolean;
  menunameFocused: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private beforePos: string;
  private moveFocused: boolean;
  private selected: boolean;

  @Input('menu') menu: any;
  @Input('entity') entity: string;
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
    private selectedMenus: SelectedMenus) {
    this.viewcfg = true;
    this.viewtools = false;
    this.viewedit = false;
    this.menunameFocused = false;
    this.viewmove = false;
    this.moveFocused = false;
  }

  ngOnInit() {
    this.selectedMenus.menu$.subscribe(updatedMenu => {
      this.selected = updatedMenu.personmenu[this.entity] == this.menu.pme_id;
    });
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
      'portal', 'personmenu_rename', { prm_id: this.menu.pme_id, prm_name: this.menu.pme_name })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personmenu_renamed'));
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_personmenu')); });
  }

  // Delete
  onDelete() {
    this.pgService.pgcall('portal', 'personmenu_delete', { prm_id: this.menu.pme_id })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personmenu_deleted'));
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personmenu')); });
  }

  // Move
  onMove() {
    this.viewmove = true;
    this.viewtools = false;

    this.pgService.pgcall('portal', 'personmenu_list', { prm_pse_id: this.menu.pse_id })
      .then(data => {
        this.movechoices = data;
        this.moveFocused = true;
        setTimeout(() => { this.moveFocused = false; });
        if (this.movechoices.length == 1) {
          this.alerts.info(this.i18n.t('portal.alerts.no_moving_personmenu'));
          this.onCancelMove();
        }

      })
      .catch(err => { });
  }

  doMove() {
    this.pgService
      .pgcall(
      'portal', 'personmenu_move_before_position',
      { prm_id: this.menu.pme_id, prm_position: this.beforePos })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personmenu_moved'));
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_moving_personmenu')); });
  }

  onCancelMove() {
    this.viewmove = false;
    this.viewtools = false;
    this.viewcfg = true;
  }

  onClick() {
    this.selectedMenus.setPersonmenu(this.entity, this.menu.pme_id);
  }
}
