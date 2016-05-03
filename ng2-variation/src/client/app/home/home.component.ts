import {Component, OnInit, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService, PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {I18nDirective, I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsComponent, Footertip} from 'variation-toolkit/variation-toolkit';

import {UserPortalSelectComponent} from '../user-portal-select/index';
import {UserGroupSelectComponent} from '../user-group-select/index';
import {PortalMainComponent} from '../portal-main/index';

@Component({
  selector: 'home',
  templateUrl: 'app///home/home.component.html',
  styleUrls: ['app///home/home.component.css'],
  directives: [I18nDirective, AlertsComponent, Footertip,
    PortalMainComponent,
    UserPortalSelectComponent, UserGroupSelectComponent]
})
export class HomeComponent implements OnInit {

  private porId: number;

  private portal: any;
  private group: any;

  constructor(private router: Router, private userService: UserService,
    private pgService: PgService, private i18n: I18nService) {
  }
  ngOnInit() {
  }

  getUser() { return this.userService.getLogin(); }

  logout() {

    this.pgService
      .pgcall(
      'login', 'user_logout', {})
      .then((data: any) => {
        this.userService.disconnect();
        this.router.parent.navigateByUrl('/login');
      });
  }

  onUserPortalSelected(portal) {
    this.portal = portal;
    this.porId = this.portal.por_id;
  }

  onUserGroupSelected(group) {
    this.group = group;
  }


}
