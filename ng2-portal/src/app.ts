import {bootstrap} from 'angular2/platform/browser';
import {Ng2PortalApp} from './app/ng2-portal';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {I18nService} from './app/services/i18n/i18n';

bootstrap(Ng2PortalApp, [ROUTER_PROVIDERS, I18nService]);
