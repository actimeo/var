import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { InputText, Panel, Button } from 'primeng/primeng';

import { I18nService, I18nDirective } from 'ng2-i18next/ng2-i18next';
import { PgService, UserService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [I18nDirective, InputText, Panel, Button]
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('username') username: ElementRef;

  errormsg: string;

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
      { 'prm_login': username, 'prm_pwd': password, prm_rights: ['organization'] })
      .then((data: any) => {
        this.userService.connect(data.usr_token, username, null);
        this.errormsg = null;
        this.router.navigate(['/home']);
      })
      .catch(error => { this.errormsg = this.i18n.t('auth.autherror'); });

    // We call our API to log the user in. The username and password are entered
    // by the user
  }

  ngOnInit() {
  }

}
