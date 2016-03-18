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
    }
}