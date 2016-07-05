import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

import { PgService, UserService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nDirective } from 'ng2-i18next/ng2-i18next';

import { OrganizationSelectComponent } from '../organization-select';
import { OrganizationMainComponent } from '../organization-main';
import { DlgInputtextComponent } from '../dlg-inputtext';
import { DataProviderService } from '../data-provider.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [DlgInputtextComponent, MD_SIDENAV_DIRECTIVES, OrganizationSelectComponent, OrganizationMainComponent, I18nDirective]
})
export class HomeComponent implements OnInit {

  @ViewChild('organizationmain') organizationmain;
  @ViewChild('dlginputtext') dlginputtext;

  private selectedOrg: any;
  private title: string;

  constructor(private router: Router, private userService: UserService,
    private pgService: PgService, private dataProvider: DataProviderService) {
  }

  ngOnInit() {
    this.dataProvider.loadData();
  }

  getUser() { return this.userService.getLogin(); }

  logout() {

    this.pgService
      .pgcall(
      'login', 'user_logout', {})
      .then((data: any) => {
        this.userService.disconnect();
        this.router.navigate(['/login']);
      });
  }

  onOrganizationSelected(org) {
    this.selectedOrg = org;
    this.organizationmain.setOrganizationId(org.value);
    this.title = org.label;
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
