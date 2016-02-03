import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser';
import {CoredemoApp} from './coredemo_app';

bootstrap(CoredemoApp, [HTTP_PROVIDERS, 
			ROUTER_PROVIDERS,
			provide(ROUTER_PRIMARY_COMPONENT, {useValue: CoredemoApp})
		    ])
 .catch(err => console.log(err)); // useful to catch the errors

