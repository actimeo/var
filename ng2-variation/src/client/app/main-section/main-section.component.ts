import {
  Component, Input, OnInit} from 'angular2/core';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {MainMenuComponent} from '../main-menu/index';

@Component({
  selector: 'main-section',
  styleUrls: ['app///main-section/main-section.component.css'],
  templateUrl: 'app///main-section/main-section.component.html',
  providers: [],
  directives: [MainMenuComponent]
})
export class MainSectionComponent implements OnInit {
  @Input('section') section: any;

  private mainmenus: any;

  constructor(
    private pgService: PgService) { }

  ngOnInit() { this.reloadMenus(); }

  reloadMenus() {
    this.pgService.pgcall('portal', 'mainmenu_list', { prm_mse_id: this.section.mse_id })
      .then(data => { this.mainmenus = data; })
      .catch(err => { });
  }
}
