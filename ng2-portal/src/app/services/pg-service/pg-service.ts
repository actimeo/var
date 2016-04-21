import {Injectable, Optional} from 'angular2/core';
import {Http} from 'angular2/http';

import {UserService} from 'variation-user/services';

export class PgServiceConfig {
  pgPath: string;
  prmTokenName: string;
}

const DEFAULT_PATH = '/pgroot';
const DEFAULT_TOKEN_NAME = null;

@Injectable()
export class PgService {
  token: string;
  private path = DEFAULT_PATH;
  private prmTokenName = DEFAULT_TOKEN_NAME;
  cached: any = {};

  constructor(
    @Optional() private pgConfig: PgServiceConfig,
    private http: Http, private user: UserService) {

    if (pgConfig) {
      this.path = pgConfig.pgPath;
      this.prmTokenName = pgConfig.prmTokenName;
    }
  }

  pgcall(schema: string, method: string, args: any = {}) {
    if (this.prmTokenName) {
      args[this.prmTokenName] = this.user.getToken();
    }
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
      if (this.prmTokenName) {
        args[this.prmTokenName] = this.user.getToken();
      }
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
