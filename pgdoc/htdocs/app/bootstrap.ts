import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import {PgdocApp} from './pgdoc_app';

bootstrap(PgdocApp, [HTTP_PROVIDERS])
 .catch(err => console.log(err)); // useful to catch the errors

