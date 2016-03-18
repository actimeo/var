import {bootstrap} from 'angular2/platform/browser';
import {Ng2PortalApp} from './app/ng2-portal';

import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {UserService} from './app/services/user/user';
import {I18nService} from './app/services/i18n/i18n';
import {PgService} from './app/services/pg-service/pg-service';
import {AlertsService} from './app/services/alerts/alerts';

bootstrap(Ng2PortalApp, [
    ROUTER_PROVIDERS, HTTP_PROVIDERS,
    UserService, I18nService, PgService, AlertsService,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
