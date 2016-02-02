import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class PgdocService {

    constructor(private _http: Http) {}

    listSchemas() {
	// TODO Add public to ignore
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'list_schemas', { 'prm_ignore': ['pg%', 'information_schema'] })
		.then(resolve);
	});
    }

    schemaDescription(schema) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'schema_description', { 'prm_schema': schema })
		.then(resolve);
	});
    }

    schemaListTables(schema) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'schema_list_tables', { 'prm_schema': schema })
		.then(resolve);
	});
    }

    schemaListTypes(schema) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'schema_list_types', { 'prm_schema': schema })
		.then(resolve);
	});
    }

    schemaListFunctions(schema) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'schema_list_functions', { 'prm_schema': schema })
		.then(resolve);
	});
    }

    tableDescription(schema, table) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'table_description', { 'prm_schema': schema, 'prm_table': table })
		.then(resolve);
	});
    }

    tableColumns(schema, table) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'table_columns', { 'prm_schema': schema, 'prm_table': table })
		.then(resolve);
	});
    }

    typeDescription(schema, type) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'type_description', { 'prm_schema': schema, 'prm_type': type })
		.then(resolve);
	});
    }

    typeColumns(schema, type) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'type_columns', { 'prm_schema': schema, 'prm_type': type })
		.then(resolve);
	});
    }

    functionsReturningType(schema, type) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'functions_returning_type', { 'prm_schema': schema, 'prm_type': type })
		.then(resolve);
	});
    }


    functionDetails(schema, fct) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'function_details', { 'prm_schema': schema, 'prm_function': fct })
		.then(resolve);
	});
    }

    functionArguments(schema, fct) {
	return new Promise(function(resolve, reject) {
	    PgProc('/pgdoc/ajax/', 'pgdoc', 'function_arguments', { 'prm_schema': schema, 'prm_function': fct })
		.then(resolve);
	});
    }
}
