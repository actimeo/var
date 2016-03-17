import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from './../../services/pg_service';
import {I18nService} from '../../services/i18n';
import {AlertsService} from './../../services/alerts';

import {PersonmenuAdd} from '../personmenu_add/personmenu_add';
import {Personmenu} from '../personmenu/personmenu';

import {FocusDirective} from './../../directives/focus';

import {PseMovePipe} from './../../pipes/pse_move';

@Component({
  selector: 'personsection',
  styles: [`
	     .section_ops { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px; }
	     `],
  templateUrl: './app/components/personsection/personsection.html',
  providers: [],
  directives: [Personmenu, PersonmenuAdd, FocusDirective, TOOLTIP_DIRECTIVES],
  pipes: [PseMovePipe]
})
export class Personsection {
  @Input('section') section: any;
  @Output() ondelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() onchange: EventEmitter<void> = new EventEmitter<void>();

  private personmenus: any;
  private new_name: string;
  private viewedit: boolean;
  private sectionname_focused: boolean;
  private viewmove: boolean;
  private movechoices: any;
  private before_pos: string;
  private move_focused: boolean;

  constructor(
      private _pgService: PgService, 
      private i18n: I18nService,
      private alerts: AlertsService) {
    this.viewedit = false;
    this.sectionname_focused = false;
    this.viewmove = false;
    this.move_focused = false;
  }

  ngOnInit() { this.reloadMenus(); }

  reloadMenus() {
    this._pgService.pgcall('portal', 'personmenu_list', {
	prm_pse_id: this.section.pse_id
    })
          .then(data => {
              console.log("listPersonmenus: " + data);
              this.personmenus = data;
          })
          .catch(err => { console.log("err " + err); });
  }

  onMenuAdded() { this.reloadMenus(); }

  onMenuChange() { this.reloadMenus(); }

  // Delete
  onDeleteSection() {
    console.log("delete " + this.section.pse_id);
    this._pgService.pgcall('portal', 'personsection_delete', {
	prm_id: this.section.pse_id
    })
        .then(data => {
          this.ondelete.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personsection_deleted'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personsection'));
        });
  }

  // Rename
  onRenameSection() {
    this.new_name = this.section.pse_name;
    this.viewedit = true;
    this.sectionname_focused = true;
    setTimeout(() => { this.sectionname_focused = false; });
  }

  doRename() {
    this._pgService.pgcall('portal', 'personsection_rename', {
	prm_id: this.section.pse_id, 
	prm_name: this.new_name
    })
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personsection_renamed'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_personsection'));
        });
  }

  onCancelRename() { this.viewedit = false; }

  // Move
  onMoveSection() {
    this.viewmove = true;

    this._pgService.pgcall('portal', 'personsection_list', {
	prm_por_id: this.section.por_id, 
	prm_entity: this.section.pse_entity
    })
        .then(data => {
          this.movechoices = data;
          this.move_focused = true;
          setTimeout(() => { this.move_focused = false; });
          if (this.movechoices.length == 1) {
            this.alerts.info(this.i18n.t('portal.alerts.no_moving_personsection'));
            this.viewmove = false;
          }

        })
        .catch(err => { console.log("err " + err); });
  }

  doMove() {
    console.log("before pos: " + this.before_pos);
    this._pgService.pgcall('portal', 'personsection_move_before_position', {
	prm_id: this.section.pse_id, 
	prm_position: this.before_pos
    })
        .then(data => {
          this.onchange.emit(null);
          this.alerts.success(this.i18n.t('portal.alerts.personsection_moved'));
        })
        .catch(err => {
          console.log("err " + err);
          this.alerts.danger(this.i18n.t('portal.alerts.error_moving_personsection'));
        });
  }

  onCancelMove() { this.viewmove = false; }
}
