import {bootstrap} from 'angular2/platform/browser';
import {Ng2PortalApp} from './app/ng2-portal';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {I18nService} from './app/services/i18n/i18n';
import {PgService} from './app/services/pg-service/pg-service';

bootstrap(Ng2PortalApp, [ROUTER_PROVIDERS, , HTTP_PROVIDERS, I18nService, PgService]);
