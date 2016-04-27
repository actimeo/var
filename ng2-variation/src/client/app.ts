import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {HTTP_PROVIDERS} from 'angular2/http';

import {I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipService} from 'variation-toolkit/variation-toolkit';
import {
  UserService,
  PgService, PgServiceConfig} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {Ng2VariationApp} from './app/ng2-variation';

bootstrap(Ng2VariationApp, [
  HTTP_PROVIDERS,
  provide(PgServiceConfig, { useValue: { pgPath: '/pg', prmTokenName: 'prm_token' } }),
  UserService, PgService, FootertipService, AlertsService, I18nService,
  ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })]);
