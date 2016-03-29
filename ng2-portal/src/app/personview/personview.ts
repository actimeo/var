import {Component, Input} from 'angular2/core';

import {PgService} from '../services/pg-service/pg-service';
import {AlertsService} from '../services/alerts/alerts';
import {I18nService} from '../services/i18n/i18n';
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
  private editing: boolean;
  private title: string;
  private pviType: number;
  private personviewTypes: any;
  @Input('entity') entity: string;

  constructor(
    private pgService: PgService, private selectedMenus: SelectedMenus, private i18n: I18nService,
    private alerts: AlertsService) { }

  ngOnInit() {
    this.selectedMenus.menu$.subscribe(updatedMenu => {
      if (this.myPme != updatedMenu.personmenu[this.entity]) {
        this.myPme = updatedMenu.personmenu[this.entity];
        if (this.myPme != null) {
          this.reloadPersonview();
          this.editing = false;
        } else {
          this.prepareEdition();
        }
      }
    });
    this.pgService.pgcache('portal', 'personview_type_list')
      .then(data => { this.personviewTypes = data; })
      .catch(err => { });
  }

  reloadPersonview() {
    this.pgService
      .pgcall('portal', 'personview_get', { prm_entity: this.entity, prm_pme_id: this.myPme })
      .then(data => {
        this.personview = data;
        this.editing = false;
      })
      .catch(err => {
        this.personview = null;
        this.prepareEdition();
      });
  }

  setEditable(editable) {
    this.editing = editable;
    if (this.editing) {
      this.prepareEdition();
    }
  }

  save() {
    this.pgService
      .pgcall(
      'portal', 'personview_set', {
        prm_pme_id: this.myPme,
        prm_title: this.title,
        prm_icon: 'todo',
        prm_type: this.pviType
      })
      .then(data => {
        this.alerts.success(this.i18n.t('portal.alerts.personview_saved'));
        this.editing = false;
        this.reloadPersonview();
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_saving_personview')); });
  }

  delete() {
    this.pgService.pgcall('portal', 'personview_delete', { prm_pme_id: this.myPme })
      .then(data => {
        this.alerts.success(this.i18n.t('portal.alerts.personview_deleted'));
        this.personview = null;
         this.prepareEdition();
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_personview')); });
  }

  prepareEdition() {
    this.title = this.personview ? this.personview.pvi_title : '';
    this.pviType = this.personview ? this.personview.pvi_type : '';
    this.editing = true;
  }
}
