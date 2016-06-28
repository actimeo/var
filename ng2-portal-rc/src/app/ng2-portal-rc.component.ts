import { Component, provide } from '@angular/core';
import { HomeComponent } from './+home';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from '@angular/router';
import { LoginComponent } from './+login';
import {HTTP_PROVIDERS} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { UserService, PgService, PgServiceConfig }
from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {I18nServiceConfig, I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipService} from 'variation-toolkit/variation-toolkit';

declare var i18nextBrowserLanguageDetector: any;
declare var i18nextXHRBackend: any;

const I18N_PROVIDERS = [
  provide(I18nServiceConfig, {
    useValue: {
      use: [i18nextBrowserLanguageDetector, i18nextXHRBackend],
      config: {
        detection: { order: ['navigator'] },
        fallbackLng: 'en'
      }
    }
  }),
  I18nService
];

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'ng2-portal-rc.component.html',
  styleUrls: ['ng2-portal-rc.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    provide(PgServiceConfig, { useValue: { pgPath: '/pg', prmTokenName: 'prm_token' } }),
    PgService,
    ROUTER_PROVIDERS, HTTP_PROVIDERS,
    UserService, I18N_PROVIDERS,
    AlertsService, FootertipService,
    provide(LocationStrategy, { useClass: HashLocationStrategy })]
})
@Routes([
  { path: '/home', component: HomeComponent },
  { path: '/login', component: LoginComponent }
])
export class Ng2PortalRcAppComponent {
  constructor(private router: Router, private userService: UserService) {
    if (this.userService.isConnected()) {
      this.router.navigate(['/home']);
    } else {
    }
    this.router.navigate(['/login']);
  }
}
