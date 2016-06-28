import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nService, I18nDirective } from 'ng2-i18next/ng2-i18next';
import { AlertsComponent, Footertip } from 'variation-toolkit/variation-toolkit';

//import { PortalSelect } from '../portal-select/portal-select';
//import { PortalMain } from '../portal-main/portal-main';


@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  providers: [],
  directives: [/*PortalSelect, PortalMain,*/ AlertsComponent, Footertip, I18nDirective]
})
export class HomeComponent {

  private porId;

  // Here we define this component's instance variables
  // They're accessible from the template
  constructor(private router: Router, private userService: UserService,
    private i18n: I18nService, private pgService: PgService) {
  }

  getUser() { return this.userService.getLogin(); }

  logout() {

    this.pgService
      .pgcall(
      'login', 'user_logout', {})
      .then(() => {
        this.userService.disconnect();
        this.router.navigateByUrl('/login');
      });
  }
  onPortalSelected(porId) { this.porId = porId; }
}
