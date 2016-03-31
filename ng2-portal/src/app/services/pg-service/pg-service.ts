import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {UserService} from '../../services/user/user';

declare var PgProc: any;

@Injectable()
export class PgService {
  token: string;
  path = '/pg';
  cached: any = {};

  constructor(private http: Http, private user: UserService) { }

  pgcall(schema: string, method: string, args: any = {}) {
    args['prm_token'] = this.user.getToken();
    return new Promise((resolve, reject) => {
      var url = this.path + '/' + schema + '/' + method;
      this.http.post(url, JSON.stringify(args))
        .subscribe(data => { resolve(data.json()); }, err => { reject(err); }, () => { });
    });
  }

  pgcache(schema: string, method: string) {
    var cacheKey = schema + '.' + method;
    if (cacheKey in this.cached) {
      return new Promise((resolve, reject) => {
        resolve(this.cached[cacheKey]);
      });
    } else {
      var args: any = {};
      args['prm_token'] = this.user.getToken();
      return new Promise((resolve, reject) => {
        var url = this.path + '/' + schema + '/' + method;
        this.http.post(url, JSON.stringify(args))
          .subscribe(
          data => {
            this.cached[cacheKey] = data.json();
            resolve(data.json());
          }, err => {
            reject(err);
          }, () => { });
      });
    }
  }
}
