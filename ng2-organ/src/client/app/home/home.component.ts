import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';

@Component({
  selector: 'home',
  templateUrl: '../app/home/home.component.html',
  styleUrls: ['../app/home/home.component.css'],
  directives: [I18nDirective]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit() {
  }

  getUser() { return this.userService.getLogin(); }

  logout() {
    this.userService.disconnect();
    this.router.parent.navigateByUrl('/login');
  }
}
