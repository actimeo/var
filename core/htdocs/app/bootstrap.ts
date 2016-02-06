import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser';
import {CoredemoApp} from './coredemo_app';
import {I18nService} from './services/i18n';

bootstrap(CoredemoApp, [HTTP_PROVIDERS, 
			ROUTER_PROVIDERS,
			I18nService,
			provide(ROUTER_PRIMARY_COMPONENT, {useValue: CoredemoApp}),
			provide(LocationStrategy, { useClass: HashLocationStrategy })
		    ])
 .catch(err => console.log(err)); // useful to catch the errors

