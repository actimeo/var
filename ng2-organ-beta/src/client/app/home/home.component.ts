import {Component, OnInit, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService, PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsComponent, Footertip} from 'variation-toolkit/variation-toolkit';

import {InstitutionSelectComponent} from '../institution-select/institution-select.component';
import {InstitutionMainComponent} from '../institution-main/institution-main.component';

@Component({
  selector: 'home',
  templateUrl: 'app///home/home.component.html',
  styleUrls: ['app///home/home.component.css'],
  directives: [
    I18nDirective, InstitutionSelectComponent, InstitutionMainComponent,
    AlertsComponent, Footertip],
})
export class HomeComponent implements OnInit {
  @ViewChild('institutionmain') institutionmain;

  constructor(private router: Router, private userService: UserService,
    private pgService: PgService) {
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

  onInstitutionSelected(insId) { this.institutionmain.setInstitutionId(insId); }

}
