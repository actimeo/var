import {Component, Input} from 'angular2/core';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';

@Component({
  selector: 'portal-config-element',
  templateUrl: 'app///portal-config-element/portal-config-element.html',
  styleUrls: ['app///portal-config-element/portal-config-element.css'],
  providers: [],
  directives: [],
  pipes: []
})
export class PortalConfigElement {

  private boolValue: boolean;
  private myPorId: number;

  @Input() param: any;
  @Input('porId')
  set porId(newPorId: number) {
    this.myPorId = newPorId;
    this.reloadValue();
  }

  constructor(private pgService: PgService, private i18n: I18nService) { }

  ngOnInit() {
  }

  reloadValue() {
    if (this.myPorId != null) {
      switch (this.param.prm_type) {
        case 'bool': this.loadBoolValue(); break;
        case 'topic': this.loadTopicValue(); break;
      }
    }
  }

  loadBoolValue() {
    this.pgService.pgcall('portal', 'param_value_get_bool', {
      prm_por_id: this.myPorId,
      prm_param: this.param.prm_val
    })
      .then((data: boolean) => this.boolValue = data)
      .catch(err => { });
  }

  boolValueChange(e) {
    this.boolValue = e;
    console.log('e: ' + e);
    this.pgService.pgcall('portal', 'param_value_set_bool', {
      prm_por_id: this.myPorId,
      prm_param: this.param.prm_val,
      prm_value: this.boolValue
    })
      .then(data => { })
      .catch(err => { console.log('err'); });
  }

  loadTopicValue() {

  }
}
