import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {HTTP_PROVIDERS} from 'angular2/http';

import {I18nServiceConfig, I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService, FootertipService} from 'variation-toolkit/variation-toolkit';

import {Ng2PortalApp} from './app/ng2-portal';
import {
  UserService,
  PgService, PgServiceConfig} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {SelectedMenus} from './app/services/selected-menus/selected-menus';

declare var i18nextBrowserLanguageDetector: any;
declare var i18nextXHRBackend: any;

//import {enableProdMode} from 'angular2/core';
//enableProdMode();

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

bootstrap(Ng2PortalApp, [
  provide(PgServiceConfig, { useValue: { pgPath: '/pg', prmTokenName: 'prm_token' } }),
  ROUTER_PROVIDERS, HTTP_PROVIDERS,
  UserService, I18N_PROVIDERS,
  PgService, FootertipService,
  AlertsService, SelectedMenus, provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
