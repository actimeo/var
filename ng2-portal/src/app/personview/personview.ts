import {Component, Input} from 'angular2/core';

import {PgService} from '../services/pg-service/pg-service';
import {SelectedMenus} from '../services/selected-menus/selected-menus';

@Component({
  selector: 'personview',
  templateUrl: 'app///personview/personview.html',
  styleUrls: ['app///personview/personview.css'],
  providers: [],
  directives: [],
  pipes: []
})
export class Personview {
  private myPme: number;
  private personview: any;

  @Input('entity') entity: string;

  constructor(private pgService: PgService, private selectedMenus: SelectedMenus) {
  }

  ngOnInit() {
    this.selectedMenus.menu$.subscribe(updatedMenu => {
      if (this.myPme != updatedMenu.personmenu[this.entity]) {
        this.myPme = updatedMenu.personmenu[this.entity];
        if (this.myPme != null) {
          this.reloadPersonview();
        }
      }
    });
  }

  reloadPersonview() {
    this.pgService.pgcall('portal', 'personview_get', {
      prm_entity: this.entity, prm_pme_id: this.myPme })
      .then(data => { this.personview = data; })
      .catch(err => { this.personview = null; });
  }
}
