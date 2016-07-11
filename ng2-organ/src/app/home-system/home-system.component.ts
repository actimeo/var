import { Component, OnInit, ViewChild } from '@angular/core';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

import { PgService, UserService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nDirective } from 'ng2-i18next/ng2-i18next';

import { TopbarService } from '../topbar.service';

@Component({
  moduleId: module.id,
  selector: 'app-home-system',
  templateUrl: 'home-system.component.html',
  styleUrls: ['home-system.component.css'],
  directives: [MD_SIDENAV_DIRECTIVES, I18nDirective]
})
export class HomeSystemComponent implements OnInit {

  @ViewChild('start') start;

  constructor(private userService: UserService, private pgService: PgService, private topbar: TopbarService) {
    this.topbar.menuOpen$.subscribe(m => this.start.toggle());
  }

  ngOnInit() {
  }

  getUser() { return this.userService.getLogin(); }

}
