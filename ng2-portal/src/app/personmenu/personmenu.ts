import {
  Component, Input, Output, EventEmitter,
  ViewChild, ElementRef, Renderer,
  OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipDirective} from 'variation-toolkit/variation-toolkit';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {SelectedMenus} from '../services/selected-menus/selected-menus';
import {PmeMovePipe} from '../pipes/pme-move/pme-move';

import { DbPersonmenu } from '../db.models/portal';

@Component({
  selector: 'personmenu',
  styleUrls: ['app/personmenu/personmenu.css'],
  templateUrl: 'app/personmenu/personmenu.html',
  providers: [],
  directives: [TOOLTIP_DIRECTIVES, FootertipDirective, I18nDirective],
  pipes: [PmeMovePipe],
})
export class Personmenu implements OnInit, OnDestroy {
  viewcfg: boolean;
  viewtools: boolean;
  viewedit: boolean;
  private viewmove: boolean;
  private movechoices: DbPersonmenu[];
  private beforePos: string;
  private selected: boolean;
  private subscription: Subscription;

  @Input('menu') menu: any;
  @Input('entity') entity: string;
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('inputname') inputname: ElementRef;
  @ViewChild('selectmenu') selectmenu: ElementRef;

  constructor(
    private pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
    private selectedMenus: SelectedMenus, private renderer: Renderer) {
    this.viewcfg = true;
    this.viewtools = false;
    this.viewedit = false;
    this.viewmove = false;
  }

  ngOnInit() {
    this.selected = this.selectedMenus.getPersonmenu(this.entity) == this.menu.pme_id;

    this.subscription = this.selectedMenus.menu$.subscribe(updatedMenu => {
      this.selected = updatedMenu.personmenu[this.entity] == this.menu.pme_id;
    });
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
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
    setTimeout(() => this.setFocus(this.inputname));
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
      .then(() => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personmenu_renamed'));
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_personmenu')); });
  }

  // Delete
  onDelete() {
    this.pgService.pgcall('portal', 'personmenu_delete', { prm_id: this.menu.pme_id })
      .then(() => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personmenu_deleted'));
        if (this.selectedMenus.getPersonmenu(this.entity) == this.menu.pme_id) {
          this.selectedMenus.setPersonmenu(this.entity, null);
        }
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personmenu')); });
  }

  // Move
  onMove() {
    this.viewmove = true;
    this.viewtools = false;

    this.pgService.pgcall('portal', 'personmenu_list', { prm_pse_id: this.menu.pse_id })
      .then((data: DbPersonmenu[]) => {
        this.movechoices = data;
        if (this.movechoices.length == 1) {
          this.alerts.info(this.i18n.t('portal.alerts.no_moving_personmenu'));
          this.onCancelMove();
        }
        setTimeout(() => this.setFocus(this.selectmenu));
      })
      .catch(err => { });
  }

  doMove() {
    this.pgService
      .pgcall(
      'portal', 'personmenu_move_before_position',
      { prm_id: this.menu.pme_id, prm_position: this.beforePos })
      .then(() => {
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

  onClick() { this.selectedMenus.setPersonmenu(this.entity, this.menu.pme_id); }

  setFocus(input: ElementRef) {
    if (input != null) {
      this.renderer.invokeElementMethod(input.nativeElement, 'focus', null);
    }
  }
}
