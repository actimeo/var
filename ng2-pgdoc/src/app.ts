import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT,
  LocationStrategy, HashLocationStrategy} from 'angular2/router';

import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {PgService, PgServiceConfig} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {PgdocApp} from './app/ng2-pgdoc';
import {NavigationService} from './app/services/navigation/navigation';

bootstrap(
  PgdocApp, [
    UserService, PgService, provide(PgServiceConfig, { useValue: { pgPath: '/pg' } }),
    HTTP_PROVIDERS, ROUTER_PROVIDERS, provide(ROUTER_PRIMARY_COMPONENT, { useValue: PgdocApp }),
    provide(LocationStrategy, { useClass: HashLocationStrategy }), MATERIAL_PROVIDERS,
    NavigationService
  ]);
