///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {
  ROUTER_PROVIDERS,
  ROUTER_PRIMARY_COMPONENT,
  LocationStrategy,
  HashLocationStrategy
} from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser';
import {PortaldemoApp} from './portaldemo_app';
import {I18nService} from './services/i18n';
import {UserService} from './services/user';
import {AlertsService} from './services/alerts';
import {PgService} from './services/pg_service';

bootstrap(PortaldemoApp, [
  HTTP_PROVIDERS, ROUTER_PROVIDERS, I18nService, UserService, AlertsService, PgService,
  provide(ROUTER_PRIMARY_COMPONENT, {useValue: PortaldemoApp}),
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]).catch(err => console.log(err));  // useful to catch the errors
