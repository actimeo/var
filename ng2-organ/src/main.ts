import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide, enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import 'i18next';
import 'i18nextBrowserLanguageDetector';
import 'i18nextXHRBackend';

import { AppComponent, environment } from './app/';

import { I18nServiceConfig, I18nService } from 'ng2-i18next/ng2-i18next';
import {
  UserService,
  PgService, PgServiceConfig} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';


declare var i18nextBrowserLanguageDetector: any;
declare var i18nextXHRBackend: any;

if (environment.production) {
  enableProdMode();
}

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

const PG_PROVIDERS = [
  provide(PgServiceConfig, {
    useValue: {
      pgPath: 'http://organ.variation.v2/pg',
      prmTokenName: 'prm_token'
    }
  }),
  UserService, PgService];

bootstrap(AppComponent, [HTTP_PROVIDERS, I18N_PROVIDERS, PG_PROVIDERS]);
