import {Component} from 'angular2/core';

import {PgService} from '../services/pg-service/pg-service';
import {SelectedMenus} from '../services/selected-menus/selected-menus';

@Component({
  selector: 'mainview',
  templateUrl: 'app///mainview/mainview.html',
  styleUrls: ['app///mainview/mainview.css'],
  providers: [],
  directives: [],
  pipes: []
})
export class Mainview {
  private myMme: number;
  private mainview: any;

  constructor(private pgService: PgService, private selectedMenus: SelectedMenus) {
  }

  ngOnInit() {
    this.selectedMenus.menu$.subscribe(updatedMenu => {
      if (this.myMme != updatedMenu.mainmenu) {
        this.myMme = updatedMenu.mainmenu;
        this.reloadMainview();
      }
    });
  }

  reloadMainview() {
    this.pgService.pgcall('portal', 'mainview_get', { prm_mme_id: this.myMme })
      .then(data => { this.mainview = data; })
      .catch(err => { this.mainview = null; });
  }
}
