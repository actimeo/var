import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {APP_BASE_HREF, ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT, LocationStrategy, HashLocationStrategy} from 'angular2/router';

import {MATERIAL_PROVIDERS} from 'ng2-material/all';

import {PgdocApp} from './app/ng2-pgdoc';
import {NavigationService} from './app/services/navigation/navigation';

bootstrap(
    PgdocApp, [[
      HTTP_PROVIDERS, ROUTER_PROVIDERS, provide(ROUTER_PRIMARY_COMPONENT, {useValue: PgdocApp}),
      provide(LocationStrategy, {useClass: HashLocationStrategy}), MATERIAL_PROVIDERS,
      NavigationService
    ]]);
