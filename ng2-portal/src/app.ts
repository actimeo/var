import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {UserService} from 'variation-user/services';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';

import {Ng2PortalApp} from './app/ng2-portal';

//import {I18nService} from './app/services/i18n/i18n';
import {PgService} from './app/services/pg-service/pg-service';
import {FootertipService} from './app/services/footertip/footertip';
import {AlertsService} from './app/services/alerts/alerts';
import {SelectedMenus} from './app/services/selected-menus/selected-menus';

bootstrap(Ng2PortalApp, [
  ROUTER_PROVIDERS, HTTP_PROVIDERS,
  UserService, I18nService, I18nDirective,
  PgService, FootertipService,
  AlertsService, SelectedMenus, provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
