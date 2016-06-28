import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {HTTP_PROVIDERS} from 'angular2/http';

import {I18nServiceConfig, I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipService} from 'variation-toolkit/variation-toolkit';
import {
  UserService,
  PgService, PgServiceConfig} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {Ng2OrganApp} from './app/ng2-organ';

declare var i18nextBrowserLanguageDetector: any;
declare var i18nextXHRBackend: any;

const I18N_PROVIDERS = [
    provide(I18nServiceConfig, {
        useValue: {
            use: [i18nextBrowserLanguageDetector, i18nextXHRBackend],
            config: {
                detection: {order: ['navigator']},
                fallbackLng: 'en'
            }
        }
    }),
    I18nService
];

bootstrap(Ng2OrganApp, [
  HTTP_PROVIDERS, I18N_PROVIDERS,
  provide(PgServiceConfig, { useValue: { pgPath: 'http://v2.variation.fr/pg', prmTokenName: 'prm_token' } }),
  UserService, PgService, FootertipService, AlertsService, I18nService,
  ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })]);
