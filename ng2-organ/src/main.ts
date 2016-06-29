import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide, enableProdMode } from '@angular/core';

import 'i18next';
import 'i18nextBrowserLanguageDetector';
import 'i18nextXHRBackend';

import { AppComponent, environment } from './app/';

import {I18nServiceConfig, I18nService} from 'ng2-i18next/ng2-i18next';


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
                detection: {order: ['navigator']},
                fallbackLng: 'en'
            }
        }
    }),
    I18nService
];

bootstrap(AppComponent, [I18N_PROVIDERS]);
