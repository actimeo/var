import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from '../../services/user';
import {I18nService} from '../../services/i18n';

declare var PgProc: any;

@Component({
  selector : 'login-cmp',
  styles : [ `
	     .body { padding-top: 50px; height: 100%; background-color: #009688; }
	     .loginform { margin: 0 auto; width: 300px; box-shadow: 0 0 15px #627d92; border-radius: 4px; }
	     ` ],
  template : `
	<div class="body">
	<div class="panel panel-default loginform">
	<div class="panel-heading"><h3 class="panel-title">{{i18n.t('auth.connect_title')}}</h3></div>
	<div class="panel-body">
	<form (submit)="login($event, username.value, password.value)">
	<div class="form-group">
	<label for="username">{{i18n.t('auth.username')}}</label>
	<input type="text" #username class="form-control" id="username" placeholder="{{i18n.t('auth.username')}}">
	</div>
	<div class="form-group">
	<label for="password">{{i18n.t('auth.password')}}</label>
	<input type="password" #password class="form-control" id="password" placeholder="{{i18n.t('auth.password')}}">
	</div>
	<button type="submit" class="btn btn-primary">{{i18n.t('auth.submit')}}</button>
	</form>
	<div [hidden]="!errormsg"><p class="text-danger">{{errormsg}}</p></div>
	</div></div></div>
	`,
  providers : [ UserService ]
})
export class LoginCmp {

  errormsg: string;

  // We inject the router via DI
  constructor(private _router: Router, private _userService: UserService,
              private i18n: I18nService) {}

  login(event, username, password) {
    event.preventDefault();

    PgProc('/auth/ajax/', 'login', 'user_login', {
      'prm_login' : username,
      'prm_pwd' : password,
      prm_rights : [ 'structure' ]
    })
        .then((data) => {
          this._userService.connect(data.usr_token, username);
          this.errormsg = null;
          console.log(data);
          this._router.parent.navigateByUrl('/home');
        })
        .catch(error => {
          console.log(error);
          this.errormsg = this.i18n.t('auth.autherror');
        });

    // We call our API to log the user in. The username and password are entered
    // by the user
  }
}
