import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class PgdocService {

    constructor(private _http: Http) {}

    listSchemas() {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'list_schemas', { 'prm_prefix_ignore': 'pg' })
		.then(resolve);
	});
    }
}
