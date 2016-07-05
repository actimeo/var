import { Component, OnInit } from '@angular/core';
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
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [ROUTER_DIRECTIVES, DlgInputtextComponent, MD_SIDENAV_DIRECTIVES,
    OrganizationSelectComponent, OrganizationMainComponent, I18nDirective],
  providers: [TopbarService]
})
export class HomeComponent implements OnInit {

  private title: string;
  private subtitle: string;

  constructor(private router: Router, private userService: UserService,
    private pgService: PgService, private topbar: TopbarService) {
    this.topbar.title$.subscribe(t => this.title = t);
    this.topbar.subtitle$.subscribe(s => this.subtitle = s);
  }

  ngOnInit() {
  }

  logout() {

    this.pgService
      .pgcall(
      'login', 'user_logout', {})
      .then((data: any) => {
        this.userService.disconnect();
        this.router.navigate(['/login']);
      });
  }

  menuToggle() {
    this.topbar.setMenuOpen(true);
  }
}
