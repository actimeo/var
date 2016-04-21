import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService} from 'variation-toolkit/variation-toolkit';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {SelectedMenus} from '../services/selected-menus/selected-menus';

import {Groupby} from '../pipes/groupby/groupby';

@Component({
  selector: 'mainview',
  templateUrl: 'app///mainview/mainview.html',
  styleUrls: ['app///mainview/mainview.css'],
  providers: [],
  directives: [I18nDirective],
  pipes: [Groupby]
})
export class Mainview implements OnInit, OnDestroy {
  private myMme: number;
  private mainview: any;
  private personviewAssociated: any;
  private editing: boolean;
  private title: string;
  private patientViews: any;
  private pmeAssociated: number;
  private mveType: string; // selected type
  private mveId: any; // selected view 
  private mainviewTypes: any; // list of types
  private mainviewsInType: any; // list of views in the selected type
  private subscription: Subscription;

  @Input('entity') entity: string;
  @Input('porId') porId: string;

  constructor(
    private pgService: PgService, private selectedMenus: SelectedMenus, private i18n: I18nService,
    private alerts: AlertsService) { }

  ngOnInit() {
    this.subscription = this.selectedMenus.menu$.subscribe(updatedMenu => {
      if (this.myMme != updatedMenu.mainmenu) {
        this.myMme = updatedMenu.mainmenu;
        if (this.myMme != null) {
          this.reloadMainview();
          this.editing = false;
        } else {
          this.prepareEdition();
        }
      }
    });
    this.pgService.pgcache('portal', 'mainview_element_type_list')
      .then(data => { this.mainviewTypes = data; })
      .catch(err => { });
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  reloadMainview() {
    this.pgService
      .pgcall('portal', 'mainview_get_details', { prm_entity: this.entity, prm_mme_id: this.myMme })
      .then(data => {
        this.mainview = data;
        this.loadAssociatedPersonview();
        this.editing = false;
      })
      .catch(err => {
        this.mainview = null;
        this.prepareEdition();
      });
  }

  loadAssociatedPersonview() {
    if (this.mainview.pme_id_associated != 0) {
      this.pgService
        .pgcall(
        'portal', 'personview_get',
        { prm_entity: 'patient', prm_pme_id: this.mainview.pme_id_associated })
        .then(data => { this.personviewAssociated = data; })
        .catch(err => { this.personviewAssociated = null; });
    }
  }

  setEditable(editable) {
    this.editing = editable;
    if (this.editing) {
      this.prepareEdition();
    }
  }

  save() {
    this.pgService
      .pgcall('portal', 'mainview_set', {
        prm_mme_id: this.myMme,
        prm_title: this.title,
        prm_icon: 'todo',
        prm_mve_id: this.mveId,
        prm_pme_id_associated: this.pmeAssociated != 0 ? this.pmeAssociated : null
      })
      .then(data => {
        this.alerts.success(this.i18n.t('portal.alerts.mainview_saved'));
        this.editing = false;
        this.reloadMainview();
      })
      .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_saving_mainview')); });
  }

  delete() {
    this.pgService.pgcall('portal', 'mainview_delete', { prm_mme_id: this.myMme })
      .then(data => {
        this.alerts.success(this.i18n.t('portal.alerts.mainview_deleted'));
        this.mainview = null;
        this.prepareEdition();
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_deleting_mainview')); });
  }

  prepareEdition() {
    this.title = this.mainview ? this.mainview.mvi_title : '';
    this.mveType = this.mainview ? this.mainview.mve_type : '';
    this.mveId = this.mainview ? this.mainview.mve_id : '';
    this.pmeAssociated = this.mainview ?
      (this.mainview.pme_id_associated ? this.mainview.pme_id_associated : 0) : 0;
    this.editing = true;
    this.loadPatientViews();
    this.loadElements(this.mveId);
  }

  loadPatientViews() {
    this.pgService.pgcall('portal', 'personview_details_list', {
      prm_entity: 'patient', prm_por_id: this.porId
    })
      .then((data: any) => {
        this.patientViews = (new Groupby).transform(data, 'pse_name');
      })
      .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_loading_mainview')); });
  }

  onTypeChange(newValue: string) {
    this.mveType = newValue;
    console.log('type changed to: ' + this.mveType);
    this.loadElements('');
  }

  loadElements(newMveId) {
    if (this.mveType) {
      this.pgService.pgcall('portal', 'mainview_element_list', {
        prm_type: this.mveType
      })
        .then((data: any) => {
          console.log(data);
          this.mainviewsInType = data;
          this.mveId = newMveId;
        })
        .catch(err => {
          this.alerts.danger(this.i18n.t('portal.alerts.error_loading_mainview_elements'));
        });
    } else {
      this.mainviewsInType = [];
      this.mveId = '';
    }
  }
}
