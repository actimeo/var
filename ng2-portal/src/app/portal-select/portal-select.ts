import {Component, Output, EventEmitter} from 'angular2/core';

import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';
import {AlertsService} from '../services/alerts/alerts';

import {FocusDirective} from '../directives/focus/focus';

@Component({
  selector: 'portal-select',
  styleUrls: ['app/portal-select/portal-select.css'],
  templateUrl: 'app/portal-select/portal-select.html',
  providers: [],
  directives: [DROPDOWN_DIRECTIVES, FocusDirective]
})
export class PortalSelect {
  static OP_NONE = 0;
  static OP_ADD = 1;
  static OP_RENAME = 2;

  @Output() onselected: EventEmitter<string> = new EventEmitter();

  portals: any;
  selectedPortal: any;
  selectedPortalName: string;
  portalName: any;
  gettingName: boolean;
  portalnameFocused: boolean;
  currentOperation: number;

  constructor(
      private pgService: PgService, private i18n: I18nService, private alerts: AlertsService) {
    this.unselectPortal();
    this.gettingName = false;
    this.portalnameFocused = false;
    this.currentOperation = PortalSelect.OP_NONE;
  }

  ngOnInit() { this.reloadPortals(null); }

  unselectPortal() {
    this.selectedPortal = null;
    this.selectedPortalName = this.i18n.t('portal.select_a_portal');
    this.onselected.emit(null);
  }

  // Reload portals and select the specified one (or none if null)
  reloadPortals(selectedPorId) {
    this.pgService.pgcall('portal', 'portal_list')
        .then(data => {
          this.portals = data;
          if (selectedPorId !== null) {
            var p = this.portals.filter(d => d.por_id == selectedPorId);
            if (p.length == 1) {
              this.onPortalSelected(p[0]);
            }
          }
        })
        .catch(err => {});
  }

  // A portal is selected in the list
  onPortalSelected(p) {
    this.selectedPortal = p;
    this.selectedPortalName = p.por_name;
    this.onselected.emit(p.por_id);
  }

  // "Add portal" entry is selected in the list
  onAddPortal() {
    this.gettingName = true;
    this.portalnameFocused = true;
    this.currentOperation = PortalSelect.OP_ADD;
    // set false to be able to set it to true again
    setTimeout(() => { this.portalnameFocused = false; });
  }

  // The "Rename portal" entry is selected in the list
  onRenamePortal() {
    this.gettingName = true;
    this.portalName = this.selectedPortal.por_name;
    this.portalnameFocused = true;
    this.currentOperation = PortalSelect.OP_RENAME;
    // set false to be able to set it to true again
    setTimeout(() => { this.portalnameFocused = false; });
  }

  // The "Delete portal" entry is selected in the list
  onDeletePortal() {
    this.pgService.pgcall('portal', 'portal_delete', {prm_id: this.selectedPortal.por_id})
        .then(data => {
          this.unselectPortal();
          this.reloadPortals(null);
          this.alerts.success(this.i18n.t('portal.alerts.portal_deleted'));
        })
        .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_portal')); });
  }

  onCopyPortal() {}

  // name input is cancelled
  cancelOperation() {
    this.gettingName = false;
    this.portalName = '';
    this.currentOperation = PortalSelect.OP_NONE;
  }

  // name input is validated
  doOperation() {
    if (this.currentOperation == PortalSelect.OP_ADD) {
      this.doAddPortal();
    } else if (this.currentOperation == PortalSelect.OP_RENAME) {
      this.doRenamePortal();
    }
  }

  // The Add portal form is submitted. Let save the portal
  doAddPortal() {
    this.pgService.pgcall('portal', 'portal_add', {prm_name: this.portalName})
        .then(newPorId => {
          this.reloadPortals(newPorId);
          this.alerts.success(this.i18n.t('portal.alerts.portal_added'));
        })
        .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_adding_portal')); });
    this.cancelOperation();
  }

  doRenamePortal() {
    this.pgService
        .pgcall(
            'portal', 'portal_rename',
            {prm_id: this.selectedPortal.por_id, prm_name: this.portalName})
        .then(data => {
          this.reloadPortals(this.selectedPortal.por_id);
          this.alerts.success(this.i18n.t('portal.alerts.portal_renamed'));
        })
        .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_renaming_portal')); });
    this.cancelOperation();
  }
}
