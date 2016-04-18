import {Component, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from 'variation-user/services';
import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsComponent} from 'variation-toolkit/variation-toolkit';

import {Footertip} from '../footertip/footertip';
import {PortalSelect} from '../portal-select/portal-select';
import {PortalMain} from '../portal-main/portal-main';


@Component({
  selector: 'home-cmp',
  styleUrls: ['app/home/home.css'],
  templateUrl: './app/home/home.html',
  providers: [],
  directives: [PortalSelect, PortalMain, AlertsComponent, Footertip, I18nDirective]
})
export class HomeCmp {
  @ViewChild('portalmain') portalmain;

  // Here we define this component's instance variables
  // They're accessible from the template
  constructor(private router: Router, private userService: UserService, private i18n: I18nService) {
  }

  getUser() { return this.userService.getLogin(); }

  logout() {
    this.userService.disconnect();
    this.router.parent.navigateByUrl('/login');
  }

  onPortalSelected(porId) { this.portalmain.setPortalId(porId); }
}
