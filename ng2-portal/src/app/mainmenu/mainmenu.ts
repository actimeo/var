import {
  Component, Input, Output, EventEmitter,
  ViewChild, ElementRef, Renderer,
  OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipDirective} from 'variation-toolkit/variation-toolkit';

import {PgService} from '../services/pg-service/pg-service';
import {SelectedMenus} from '../services/selected-menus/selected-menus';
import {MmeMovePipe} from '../pipes/mme-move/mme-move';

@Component({
  selector: 'mainmenu',
  styleUrls: ['app/mainmenu/mainmenu.css'],
  templateUrl: 'app/mainmenu/mainmenu.html',
  providers: [],
  directives: [TOOLTIP_DIRECTIVES, FootertipDirective, I18nDirective],
  pipes: [MmeMovePipe],
})
export class Mainmenu implements OnInit, OnDestroy {
  viewcfg: boolean;
  viewtools: boolean;
  viewedit: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private beforePos: string;
  private selected: boolean;
  private subscription: Subscription;

  @Input('menu') menu: any;
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
    this.selected = this.selectedMenus.getMainmenu() == this.menu.mme_id;

    this.subscription = this.selectedMenus.menu$.subscribe(
      updatedMenu => { this.selected = updatedMenu.mainmenu == this.menu.mme_id; });
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
      'portal', 'mainmenu_rename', { prm_id: this.menu.mme_id, prm_name: this.menu.mme_name })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.mainmenu_renamed'));
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_mainmenu')); });
  }

  // Delete
  onDelete() {
    this.pgService.pgcall('portal', 'mainmenu_delete', { prm_id: this.menu.mme_id })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.mainmenu_deleted'));
        if (this.selectedMenus.getMainmenu() == this.menu.mme_id) {
          this.selectedMenus.setMainmenu(null);
        }
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainmenu')); });
  }

  // Move
  onMove() {
    this.viewmove = true;
    this.viewtools = false;

    this.pgService.pgcall('portal', 'mainmenu_list', { prm_mse_id: this.menu.mse_id })
      .then(data => {
        this.movechoices = data;
        if (this.movechoices.length == 1) {
          this.alerts.info(this.i18n.t('portal.alerts.no_moving_mainmenu'));
          this.onCancelMove();
        }
        setTimeout(() => this.setFocus(this.selectmenu));
      })
      .catch(err => { });
  }

  doMove() {
    this.pgService
      .pgcall(
      'portal', 'mainmenu_move_before_position',
      { prm_id: this.menu.mme_id, prm_position: this.beforePos })
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

  onClick() { this.selectedMenus.setMainmenu(this.menu.mme_id); }

  setFocus(input: ElementRef) {
    if (input != null) {
      this.renderer.invokeElementMethod(input.nativeElement, 'focus', null);
    }
  }
}
