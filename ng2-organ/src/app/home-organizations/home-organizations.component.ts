import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

import { PgService, UserService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nDirective } from 'ng2-i18next/ng2-i18next';

import { OrganizationSelectComponent } from '../organization-select';
import { OrganizationMainComponent } from '../organization-main';
import { DlgInputtextComponent } from '../dlg-inputtext';
import { TopbarService } from '../topbar.service';

@Component({
  moduleId: module.id,
  selector: 'app-home-organizations',
  templateUrl: 'home-organizations.component.html',
  styleUrls: ['home-organizations.component.css'],
  directives: [ROUTER_DIRECTIVES, DlgInputtextComponent, MD_SIDENAV_DIRECTIVES,
    OrganizationSelectComponent, OrganizationMainComponent, I18nDirective]
})
export class HomeOrganizationsComponent implements OnInit {

  @ViewChild('organizationmain') organizationmain;
  @ViewChild('dlginputtext') dlginputtext;
  @ViewChild('start') start;

  private selectedOrg: any;

  constructor(private router: Router, private userService: UserService,
    private pgService: PgService,
    private topbar: TopbarService) {
    this.topbar.menuOpen$.subscribe(m => this.start.toggle());
  }

  ngOnInit() {
//    this.dataProvider.loadData();
  }

  getUser() { return this.userService.getLogin(); }

  onOrganizationSelected(org) {
    this.selectedOrg = org;
    this.organizationmain.setOrganizationId(org.value);
    this.topbar.setTitle(org.label);
    this.topbar.setSubtitle('Organization');
  }

  onOrganizationAdd() {
    this.dlginputtext.show('dialog.add_organization.title', 'dialog.add_organization.label');
  }

  protected onDlgInputOk(text: string) {
    console.log('dlg inputtext ok with val: ' + text);
  }

  protected onDlgInputCancel() {
    console.log('dlg inputtext cancel');
  }
}
