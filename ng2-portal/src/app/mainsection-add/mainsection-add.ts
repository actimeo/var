import {
  Component, Input, Output, EventEmitter,
  ViewChild, ElementRef, Renderer} from 'angular2/core';

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {AlertsService} from 'variation-toolkit/variation-toolkit';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'mainsection-add',
  styleUrls: [],
  templateUrl: 'app/mainsection-add/mainsection-add.html',
  providers: [],
  directives: [BUTTON_DIRECTIVES, I18nDirective],
})
export class MainsectionAdd {
  @Input('porId') porId: number;
  @Output() onadded: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('inputname') inputname: ElementRef;

  sectionname: any;
  gettingName: boolean;

  constructor(
    private pgService: PgService, private i18n: I18nService, private alerts: AlertsService,
    private renderer: Renderer) {
    this.gettingName = false;
  }

  onAddSection() {
    this.gettingName = true;
    setTimeout(() => this.setFocusToInputName());
  }

  cancelAddSection() {
    this.gettingName = false;
    this.sectionname = '';
  }

  doAddSection() {
    this.pgService
      .pgcall('portal', 'mainsection_add', { prm_por_id: this.porId, prm_name: this.sectionname })
      .then((newMseId: number) => {
        this.onadded.emit(null);
        this.alerts.success(this.i18n.t('portal.alerts.mainsection_added'));
      })
      .catch(
      err => { this.alerts.danger(this.i18n.t('portal.alerts.error_adding_mainsection')); });
    this.cancelAddSection();
  }

  setFocusToInputName() {
    this.renderer.invokeElementMethod(this.inputname.nativeElement, 'focus', null);
  }
}
