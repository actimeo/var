import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Dropdown } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nService } from 'ng2-i18next/ng2-i18next';

@Component({
  moduleId: module.id,
  selector: 'app-organization-select',
  templateUrl: 'organization-select.component.html',
  styleUrls: ['organization-select.component.css'],
  directives: [Dropdown]
})
export class OrganizationSelectComponent implements OnInit {

  @Output() onselected: EventEmitter<string> = new EventEmitter<string>();

  private organizations: any;
  organizationsDdList: SelectItem[];
  selectedOrg: SelectItem;

  constructor(private pgService: PgService, private i18n: I18nService) { }

  ngOnInit() {
    this.reloadOrganizations(null);
  }

  // Reload organizations and select the specified one (or none if null)
  private reloadOrganizations(selectedOrgId) {
    this.pgService.pgcall('organ', 'organization_list')
      .then(data => {
        this.organizations = data;
        this.rebuildDdList();
        if (selectedOrgId !== null) {
          let p = this.organizations.filter(d => d.org_id === selectedOrgId);
          if (p.length === 1) {
            this.onOrganizationSelected(p.org_id);
          }
        }
      })
      .catch(err => { });
  }

  private rebuildDdList() {
    this.organizationsDdList = [];
    this.organizations.map(o => {
      this.organizationsDdList.push({
        label: o.org_name,
        value: o.org_id
      });
    });
  }

  onOrganizationSelected(id) {
    //    this.selectedInstitution = p;
    //    this.selectedInstitutionName = p.org_name;
    console.log('select 1b');
    this.onselected.emit(id);
  }


}
