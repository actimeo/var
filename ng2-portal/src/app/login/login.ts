import {Component, ElementRef, ViewChild, Renderer} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from 'variation-user/services';

import {I18nService} from '../services/i18n/i18n';
import {PgService} from '../services/pg-service/pg-service';

import {I18nDirective} from '../directives/i18n/i18n';

@Component({
  selector: 'login-cmp',
  styleUrls: ['app/login/login.css'],
  templateUrl: 'app/login/login.html',
  providers: [],
  directives: [I18nDirective]
})
export class LoginCmp {
  @ViewChild('username') username: ElementRef;

  errormsg: string;

  // We inject the router via DI
  constructor(
    private router: Router, private userService: UserService, private i18n: I18nService,
    private pgService: PgService, private renderer: Renderer) { }

  ngAfterViewInit() {
    // set focus to username
    this.renderer.invokeElementMethod(this.username.nativeElement, 'focus', null);
  }

  login(event, username, password) {
    event.preventDefault();
    this.pgService
      .pgcall(
      'login', 'user_login',
      { 'prm_login': username, 'prm_pwd': password, prm_rights: ['structure'] })
      .then((data: any) => {
        this.userService.connect(data.usr_token, username);
        this.errormsg = null;
        this.router.parent.navigateByUrl('/home');
      })
      .catch(error => { this.errormsg = this.i18n.t('auth.autherror'); });

    // We call our API to log the user in. The username and password are entered
    // by the user
  }
}
