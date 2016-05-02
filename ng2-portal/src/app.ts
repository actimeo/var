import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {HTTP_PROVIDERS} from 'angular2/http';

import {I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipService} from 'variation-toolkit/variation-toolkit';

import {Ng2PortalApp} from './app/ng2-portal';
import {
  UserService,
  PgService, PgServiceConfig} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {SelectedMenus} from './app/services/selected-menus/selected-menus';

//import {enableProdMode} from 'angular2/core';
//enableProdMode();

bootstrap(Ng2PortalApp, [
  provide(PgServiceConfig, { useValue: { pgPath: '/pg', prmTokenName: 'prm_token' } }),
  ROUTER_PROVIDERS, HTTP_PROVIDERS,
  UserService, I18nService,
  PgService, FootertipService,
  AlertsService, SelectedMenus, provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
