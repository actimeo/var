import {
  Component, Input, Output, EventEmitter,
  ViewChild, ElementRef, Renderer, OnInit} from 'angular2/core';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService} from 'variation-toolkit/variation-toolkit';

import {PgService} from '../services/pg-service/pg-service';
import {PersonmenuAdd} from '../personmenu-add/personmenu-add';
import {Personmenu} from '../personmenu/personmenu';

import {Footertip} from '../directives/footertip/footertip';

import {PseMovePipe} from '../pipes/pse-move/pse-move';

@Component({
  selector: 'personsection',
  styleUrls: ['app/personsection/personsection.css'],
  templateUrl: 'app/personsection/personsection.html',
  providers: [],
  directives: [PersonmenuAdd, Personmenu, Footertip, I18nDirective],
  pipes: [PseMovePipe]
})
export class Personsection implements OnInit {
  @Input('section') section: any;
  @Input('entity') entity: string;
  @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('inputname') inputname: ElementRef;
  @ViewChild('selectsection') selectsection: ElementRef;

  private personmenus: any;
  private new_name: string;
  private viewedit: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private before_pos: string;

  constructor(
    private _pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
    private renderer: Renderer) {
    this.viewedit = false;
    this.viewmove = false;
  }

  ngOnInit() { this.reloadMenus(); }

  reloadMenus() {
    this._pgService.pgcall('portal', 'personmenu_list', { prm_pse_id: this.section.pse_id })
      .then(data => { this.personmenus = data; })
      .catch(err => { });
  }

  onMenuAdded() { this.reloadMenus(); }

  onMenuChange() { this.reloadMenus(); }

  // Delete
  onDeleteSection() {
    this._pgService.pgcall('portal', 'personsection_delete', { prm_id: this.section.pse_id })
      .then(data => {
        this.ondelete.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personsection_deleted'));
      })
      .catch(err => {
        this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personsection'));
      });
  }

  // Rename
  onRenameSection() {
    this.new_name = this.section.pse_name;
    this.viewedit = true;
    setTimeout(() => this.setFocus(this.inputname));
  }

  doRename() {
    this._pgService
      .pgcall(
      'portal', 'personsection_rename',
      { prm_id: this.section.pse_id, prm_name: this.new_name })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personsection_renamed'));
      })
      .catch(err => {
        this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_personsection'));
      });
  }

  onCancelRename() { this.viewedit = false; }

  // Move
  onMoveSection() {
    this.viewmove = true;

    this._pgService
      .pgcall(
      'portal', 'personsection_list',
      { prm_por_id: this.section.por_id, prm_entity: this.section.pse_entity })
      .then(data => {
        this.movechoices = data;
        if (this.movechoices.length == 1) {
          this.alerts.info(this.i18n.t('portal.alerts.no_moving_personsection'));
          this.viewmove = false;
        }
        setTimeout(() => this.setFocus(this.selectsection));
      })
      .catch(err => { });
  }

  doMove() {
    this._pgService
      .pgcall(
      'portal', 'personsection_move_before_position',
      { prm_id: this.section.pse_id, prm_position: this.before_pos })
      .then(data => {
        this.onchange.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.personsection_moved'));
      })
      .catch(err => {
        this.alerts.danger(this.i18n.t('portal.alerts.error_moving_personsection'));
      });
  }

  onCancelMove() { this.viewmove = false; }

  setFocus(input) {
    if (input != null) {
      this.renderer.invokeElementMethod(input.nativeElement, 'focus', null);
    }
  }
}
