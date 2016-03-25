import {Component, Input} from 'angular2/core';

import {PgService} from '../services/pg-service/pg-service';
import {AlertsService} from '../services/alerts/alerts';
import {I18nService} from '../services/i18n/i18n';
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
  private editing: boolean;
  private title: string;

  @Input('entity') entity: string;


  constructor(private pgService: PgService, private selectedMenus: SelectedMenus,
  private i18n: I18nService, private alerts: AlertsService) {
  }

ngOnInit() {
    this.selectedMenus.menu$.subscribe(updatedMenu => {
      if (this.myMme != updatedMenu.mainmenu) {
        this.myMme = updatedMenu.mainmenu;
        if (this.myMme != null) {
          this.reloadMainview();
          this.editing = false;
        } else {
          this.title = '';
          this.editing = true;
        }
      }
    });
  }

  reloadMainview() {
    this.pgService.pgcall('portal', 'mainview_get', {
      prm_entity: this.entity, prm_mme_id: this.myMme })
      .then(data => { this.mainview = data; this.editing = false; })
      .catch(err => { this.mainview = null; this.title = ''; this.editing = true; });
  }

  setEditable(editable) {
    this.title = this.mainview.mvi_title;
    this.editing = editable;
  }

  save() {
    this.pgService.pgcall('portal', 'mainview_set', {
      prm_mme_id: this.myMme, prm_title: this.title, prm_icon: 'todo', prm_pme_id_associated: null
    })
    .then(data => {
      this.alerts.success(this.i18n.t('portal.alerts.mainview_saved'));
      this.editing = false;
      this.reloadMainview();
    })
    .catch(err => {
      this.alerts.danger(this.i18n.t('portal.alerts.error_saving_mainview'));
    });
  }

  delete() {
    this.pgService.pgcall('portal', 'mainview_delete', {
      prm_mme_id: this.myMme
    })
    .then(data => {
      this.alerts.success(this.i18n.t('portal.alerts.mainview_deleted'));
      this.title = '';
      this.editing = true;
    }).catch(err => {
      this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainview'));
    });
  }}
