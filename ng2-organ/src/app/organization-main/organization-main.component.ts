import { Component, OnInit } from '@angular/core';
import { TabView, TabPanel } from 'primeng/primeng';
import { I18nService } from 'ng2-i18next/ng2-i18next';

import { GroupsListComponent } from '../groups-list';

@Component({
  moduleId: module.id,
  selector: 'app-organization-main',
  templateUrl: 'organization-main.component.html',
  styleUrls: ['organization-main.component.css'],
  directives: [TabView, TabPanel, GroupsListComponent]
})
export class OrganizationMainComponent implements OnInit {
  private orgId: number;

  constructor(private i18next: I18nService) { }

  ngOnInit() {
  }

  setOrganizationId(orgId) {
    this.orgId = orgId;
  }

}
