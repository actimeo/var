import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {SelectedMenusService} from '../selected-menus.service';

@Component({
  selector: 'main-menu',
  styleUrls: ['app///main-menu/main-menu.component.css'],
  templateUrl: 'app///main-menu/main-menu.component.html',
  providers: [],
  directives: []
})
export class MainMenuComponent implements OnInit, OnDestroy {
  private selected: boolean;
  private subscription: Subscription;

  @Input() menu: any;

  constructor(
    private pgService: PgService,
    private selectedMenus: SelectedMenusService
  ) {
  }

  ngOnInit() {
    this.selected = this.selectedMenus.getMainmenu() == this.menu.mme_id;

    this.subscription = this.selectedMenus.menu$.subscribe(
      updatedMenu => { this.selected = updatedMenu.mainmenu == this.menu.mme_id; });
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  onClick() {
    this.selectedMenus.setMainmenu(this.menu.mme_id);
  }
}
