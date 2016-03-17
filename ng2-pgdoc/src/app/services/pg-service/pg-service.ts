import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

declare var PgProc: any;

@Injectable()
export class PgService {
    token: string;
    path = '/pg';

    constructor(private http: Http) { }

    pgcall(schema: string, method: string, args: any = {}) {
        console.log('pgcall');
        return new Promise((resolve, reject) => {
            var url = this.path + '/' + schema + '/' + method;
            console.log('http.post: ' + url);
            this.http.post(url, JSON.stringify(args))
                .subscribe(
                data => {
                    console.log('resolve');
                    resolve(data.json());
                },
                err => {
                    console.log('reject');
                    reject(err);
                },
                () => {
                    console.log('else');
                });
        });

        /*
                return new Promise(
                    (resolve, reject) => {
                        this.pgProc(this.path, schema, method, args).then(resolve, reject);
                    });*/
    }
    /*
        pgProc(root, schema, procedure, args) {
    
            function statusOk(response) {
                if (response.status >= 200 && response.status < 300) {
                    return Promise.resolve(response);
                } else if (response.status == 404) {
                    // return Promise.reject(new PgProcFunctionNotAvailableError(response.statusText));
                } else if (response.status == 400) {
                    // return Promise.reject(new PgProcError(response.statusText));
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            }
    
            function getJson(response) {
                return response.json()
            }
    
            return new Promise(
                function(resolve, reject) {
                    console.log('fetch');
                    window.fetch(root + '/' + schema + '/' + procedure, {
                        method: 'post',
                        body: JSON.stringify(args)
                    })
                        .then(statusOk)
                        .then(getJson)
                        .then(response => resolve(response))
                        .catch(error => reject(error));
                });
        }*/
}

/*
function PgProcFunctionNotAvailableError(message) {
    this.message = message || "PgProc function not available";
}
PgProcFunctionNotAvailableError.prototype = Object.create(Error.prototype);
PgProcFunctionNotAvailableError.prototype.constructor = PgProcFunctionNotAvailableError;


function PgProcError(message) {
    this.message = message || "PgProc error";
}
PgProcError.prototype = Object.create(Error.prototype);
PgProcError.prototype.constructor = PgProcError;


*/
