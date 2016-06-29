import {Component, Output, EventEmitter,
  ViewChild, ElementRef, Renderer, OnInit} from 'angular2/core';

import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService} from 'variation-toolkit/variation-toolkit';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'institution-select',
  templateUrl: 'app///institution-select/institution-select.component.html',
  styleUrls: ['app///institution-select/institution-select.component.css'],
  directives: [DROPDOWN_DIRECTIVES, I18nDirective]
})
export class InstitutionSelectComponent implements OnInit {
  static OP_NONE = 0;
  static OP_ADD = 1;
  static OP_RENAME = 2;

  @ViewChild('inputname') inputname: ElementRef;
  @Output() onselected: EventEmitter<string> = new EventEmitter();

  institutions: any;
  selectedInstitution: any;
  selectedInstitutionName: string;
  institutionName: any;
  gettingName: boolean;
  currentOperation: number;

  constructor(
    private pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
    private renderer: Renderer) {
    this.unselectInstitution();
    this.gettingName = false;
    this.currentOperation = InstitutionSelectComponent.OP_NONE;
  }

  ngOnInit() { this.reloadInstitutions(null); }

  unselectInstitution() {
    this.selectedInstitution = null;
    this.selectedInstitutionName = this.i18n.t('institution.select_an_institution');
    this.onselected.emit(null);
  }

  // Reload institutions and select the specified one (or none if null)
  reloadInstitutions(selectedInsId) {
    this.pgService.pgcall('organ', 'organization_list')
      .then(data => {
        this.institutions = data;
        if (selectedInsId !== null) {
          var p = this.institutions.filter(d => d.org_id == selectedInsId);
          if (p.length == 1) {
            this.onInstitutionSelected(p[0]);
          }
        }
      })
      .catch(err => { });
  }

  // An institution is selected in the list
  onInstitutionSelected(p) {
    this.selectedInstitution = p;
    this.selectedInstitutionName = p.org_name;
    this.onselected.emit(p.org_id);
  }

  // "Add institution" entry is selected in the list
  onAddInstitution() {
    this.gettingName = true;
    // Need a cycle to refresh the DOM and make inputname visible
    setTimeout(() => this.setFocusToInputName(), 0);
    this.currentOperation = InstitutionSelectComponent.OP_ADD;
  }

  // The "Rename institution" entry is selected in the list
  onRenameInstitution() {
    this.gettingName = true;
    this.institutionName = this.selectedInstitution.org_name;
    // Need a cycle to refresh the DOM and make inputname visible
    setTimeout(() => this.setFocusToInputName(), 0);
    this.currentOperation = InstitutionSelectComponent.OP_RENAME;
  }

  // The "Delete institution" entry is selected in the list
  onDeleteInstitution() {
    this.pgService.pgcall('organ', 'organiztion_delete',
      { prm_id: this.selectedInstitution.org_id })
      .then(data => {
        this.unselectInstitution();
        this.reloadInstitutions(null);
        this.alerts.success(this.i18n.t('institution.alerts.institution_deleted'));
      })
      .catch(err => {
        this.alerts.danger(this.i18n.t('institution.alerts.error_deleting_institution'));
      });
  }

  onCopyInstitution() { }

  // name input is cancelled
  cancelOperation() {
    this.gettingName = false;
    this.institutionName = '';
    this.currentOperation = InstitutionSelectComponent.OP_NONE;
  }

  // name input is validated
  doOperation() {
    if (this.currentOperation == InstitutionSelectComponent.OP_ADD) {
      this.doAddInstitution();
    } else if (this.currentOperation == InstitutionSelectComponent.OP_RENAME) {
      this.doRenameInstitution();
    }
  }

  // The Add Institution form is submitted. Let save the Institution
  doAddInstitution() {
    this.pgService.pgcall('organ', 'organization_add', { prm_name: this.institutionName })
      .then(newInsId => {
        this.reloadInstitutions(newInsId);
        this.alerts.success(this.i18n.t('institution.alerts.institution_added'));
      })
      .catch(err => {
        this.alerts.danger(this.i18n.t('institution.alerts.error_adding_institution'));
      });
    this.cancelOperation();
  }

  doRenameInstitution() {
    this.pgService
      .pgcall('organ', 'organization_rename',
      { prm_id: this.selectedInstitution.org_id, prm_name: this.institutionName })
      .then(data => {
        this.reloadInstitutions(this.selectedInstitution.org_id);
        this.alerts.success(this.i18n.t('institution.alerts.institution_renamed'));
      })
      .catch(err => {
        this.alerts.danger(this.i18n.t('institution.alerts.error_renaming_institution'));
      });
    this.cancelOperation();
  }

  setFocusToInputName() {
    if (this.inputname) {
      this.renderer.invokeElementMethod(this.inputname.nativeElement, 'focus', null);
    }
  }
}
