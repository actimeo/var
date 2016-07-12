import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Dropdown } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nService, I18nDirective } from 'ng2-i18next/ng2-i18next';
import { DbOrganization } from '../db.models/organ';

@Component({
  moduleId: module.id,
  selector: 'app-organization-select',
  templateUrl: 'organization-select.component.html',
  styleUrls: ['organization-select.component.css'],
  directives: [I18nDirective, Dropdown]
})
export class OrganizationSelectComponent implements OnInit {

  @Output() onselected: EventEmitter<string> = new EventEmitter<string>();
  @Output() onadd: EventEmitter<boolean> = new EventEmitter<boolean>();

  private organizations: DbOrganization[];
  organizationsDdListInternal: SelectItem[];
  organizationsDdListExternal: SelectItem[];

  private selectedInstitution: DbOrganization;
  private selectedInstitutionName: string;

  constructor(private pgService: PgService, private i18n: I18nService) { }

  ngOnInit() {
    this.reloadOrganizations();
  }

  // Reload organizations and select the specified one (or none if null)
  private reloadOrganizations() {
    this.pgService.pgcall('organ', 'organization_list')
      .then((data: DbOrganization[]) => {
        this.organizations = data;
        this.rebuildDdList();
      })
      .catch(err => { });
  }

  private rebuildDdList() {
    this.organizationsDdListInternal = [];
    this.organizations
      .filter(o => o.org_internal === true)
      .map(o => {
        this.organizationsDdListInternal.push({
          label: o.org_name,
          value: o.org_id
        });
      });
    this.organizationsDdListExternal = [];
    this.organizations
      .filter(o => o.org_internal === false)
      .map(o => {
        this.organizationsDdListExternal.push({
          label: o.org_name,
          value: o.org_id
        });
      });
  }

  onOrganizationSelected(org) {
    this.selectedInstitution = org.value;
    this.selectedInstitutionName = org.label;
    this.onselected.emit(org);
  }

  protected onAddInstitution() {
    this.onadd.emit(true);
  }
}
