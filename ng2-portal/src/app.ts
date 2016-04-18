import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {UserService} from 'variation-user/services';
import {I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipService} from 'variation-toolkit/variation-toolkit';

import {Ng2PortalApp} from './app/ng2-portal';
import {PgService} from './app/services/pg-service/pg-service';
import {SelectedMenus} from './app/services/selected-menus/selected-menus';

bootstrap(Ng2PortalApp, [
  ROUTER_PROVIDERS, HTTP_PROVIDERS,
  UserService, I18nService,
  PgService, FootertipService,
  AlertsService, SelectedMenus, provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
