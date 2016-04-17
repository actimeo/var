import {Component, Input} from 'angular2/core';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';

import {PgService} from '../services/pg-service/pg-service';
import {AlertsService} from '../services/alerts/alerts';
import {SelectedMenus} from '../services/selected-menus/selected-menus';

@Component({
  selector: 'personview',
  templateUrl: 'app///personview/personview.html',
  styleUrls: ['app///personview/personview.css'],
  providers: [],
  directives: [I18nDirective],
})
export class Personview {
  private myPme: number;
  private personview: any;
  private editing: boolean;
  private title: string;
  private pveType: string; // selected type
  private pveId: any; // selected view 
  private personviewTypes: any; // list of types
  private personviewsInType: any; // list of views in the selected type

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
    this.pgService.pgcache('portal', 'personview_element_type_list')
      .then(data => { this.personviewTypes = data; })
      .catch(err => { });
  }

  reloadPersonview() {
    this.pgService
      .pgcall('portal', 'personview_get_details', {
        prm_entity: this.entity, prm_pme_id: this.myPme
      })
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
      .pgcall('portal', 'personview_set', {
        prm_pme_id: this.myPme,
        prm_title: this.title,
        prm_icon: 'todo',
        prm_pve_id: this.pveId
      })
      .then(data => {
        this.alerts.success(this.i18n.t('portal.alerts.personview_saved'));
        this.editing = false;
        this.reloadPersonview();
      })
      .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_saving_personview')); });
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
    this.title = this.personview ? this.personview.mvi_title : '';
    this.pveType = this.personview ? this.personview.mve_type : '';
    this.pveId = this.personview ? this.personview.mve_id : '';
    this.editing = true;
    this.loadElements(this.pveId);
  }

  onTypeChange(newValue: string) {
    this.pveType = newValue;
    this.loadElements('');
  }

  loadElements(newPveId) {
    if (this.pveType) {
      this.pgService.pgcall('portal', 'personview_element_list', {
        prm_type: this.pveType,
        prm_entity: this.entity
      })
        .then((data: any) => {
          console.log(data);
          this.personviewsInType = data;
          this.pveId = newPveId;
        })
        .catch(err => {
          this.alerts.danger(this.i18n.t('portal.alerts.error_loading_personview_elements'));
        });
    } else {
      this.personviewsInType = [];
      this.pveId = '';
    }
  }
}
