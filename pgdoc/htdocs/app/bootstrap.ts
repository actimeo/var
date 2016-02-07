import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {APP_BASE_HREF, ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT, LocationStrategy, HashLocationStrategy } from 'angular2/router';

import {bootstrap} from 'angular2/platform/browser';

import {MATERIAL_PROVIDERS} from 'ng2-material/all';

import {PgdocApp} from './pgdoc_app';
import {NavigationService} from './services/navigation';

bootstrap(PgdocApp, [HTTP_PROVIDERS, 
		     ROUTER_PROVIDERS,
		     provide(ROUTER_PRIMARY_COMPONENT, {useValue: PgdocApp}),
		     provide(LocationStrategy, { useClass: HashLocationStrategy }),
		     MATERIAL_PROVIDERS,
		     NavigationService,
		     provide(APP_BASE_HREF, {useValue: '/pgdoc'})		     
		    ])
 .catch(err => console.log(err)); // useful to catch the errors

