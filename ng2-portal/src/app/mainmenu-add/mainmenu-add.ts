import {
  Component, Input, Output, EventEmitter,
  ViewChild, ElementRef, Renderer} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService} from 'variation-toolkit/variation-toolkit';

import {PgService} from '../services/pg-service/pg-service';
import {SelectedMenus} from '../services/selected-menus/selected-menus';

@Component({
  selector: 'mainmenu-add',
  styleUrls: [],
  templateUrl: 'app/mainmenu-add/mainmenu-add.html',
  providers: [],
  directives: [BUTTON_DIRECTIVES, I18nDirective],
})
export class MainmenuAdd {
  @Input('mseId') mseId: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('inputname') inputname: ElementRef;

  menuname: any;
  gettingName: boolean;

  constructor(
    private pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
    private selectedMenus: SelectedMenus, private renderer: Renderer) {
    this.gettingName = false;
  }

  onAddMenu() {
    this.gettingName = true;
    setTimeout(() => this.setFocusToInputName());
  }

  cancelAddMenu() {
    this.gettingName = false;
    this.menuname = '';
  }

  doAddMenu() {
    this.pgService
      .pgcall('portal', 'mainmenu_add', { prm_mse_id: this.mseId, prm_name: this.menuname })
      .then((newMmeId: number) => {
        this.onadded.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.mainmenu_added'));
        this.selectedMenus.setMainmenu(newMmeId);
      })
      .catch(err => { this.alerts.danger(this.i18n.t('portal.alerts.error_adding_mainmenu')); });
    this.cancelAddMenu();
  }

  setFocusToInputName() {
    this.renderer.invokeElementMethod(this.inputname.nativeElement, 'focus', null);
  }
}
