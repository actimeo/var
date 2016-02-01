import {bootstrap} from 'angular2/platform/browser';
import {PgdocApp} from './pgdoc_app';

bootstrap(PgdocApp)
 .catch(err => console.log(err)); // useful to catch the errors

