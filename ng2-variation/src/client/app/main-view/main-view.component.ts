import {Component, OnInit} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {SelectedMenusService} from '../selected-menus.service';

@Component({
  selector: 'main-view',
  templateUrl: 'app///main-view/main-view.component.html',
  styleUrls: ['app///main-view/main-view.component.css']
})
export class MainViewComponent implements OnInit {

  private subscription: Subscription;
  private myMme: number;
  private mainview: any;

  constructor(private pgService: PgService, private selectedMenus: SelectedMenusService) { }

  ngOnInit() {
    this.subscription = this.selectedMenus.menu$.subscribe(updatedMenu => {
      if (this.myMme != updatedMenu.mainmenu) {
        this.myMme = updatedMenu.mainmenu;
        if (this.myMme != null) {
          this.reloadMainview();
        }
      }
    });
  }

  reloadMainview() {
    this.pgService
      .pgcall('portal', 'mainview_get_details', { prm_mme_id: this.myMme })
      .then(data => {
        this.mainview = data;
      })
      .catch(err => {
        this.mainview = null;
      });
  }
}
