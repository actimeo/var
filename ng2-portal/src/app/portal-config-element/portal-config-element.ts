import {Component, Input, OnInit} from 'angular2/core';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'portal-config-element',
  templateUrl: 'app///portal-config-element/portal-config-element.html',
  styleUrls: ['app///portal-config-element/portal-config-element.css'],
  providers: [],
  directives: [I18nDirective],
  pipes: []
})
export class PortalConfigElement implements OnInit {

  private boolValue: boolean;
  private topicValue: string;

  private myPorId: number;
  private topics: string[];

  @Input() param: any;
  @Input('porId')
  set porId(newPorId: number) {
    this.myPorId = newPorId;
    this.reloadValue();
  }

  constructor(private pgService: PgService, private i18n: I18nService) { }

  ngOnInit() {
    if (this.param.prm_type == 'topic') {
      this.pgService.pgcache('portal', 'topics_list')
        .then((data: string[]) => this.topics = data)
        .catch(err => { });
    }
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
      .then(() => { })
      .catch(err => { console.log('err'); });
  }

  loadTopicValue() {
    this.pgService.pgcall('portal', 'param_value_get_topic', {
      prm_por_id: this.myPorId,
      prm_param: this.param.prm_val
    })
      .then((data: string) => this.topicValue = data)
      .catch(err => { });
  }

  topicValueChange(e: string) {
    this.topicValue = e;
    console.log('e: ' + e);
    this.pgService.pgcall('portal', 'param_value_set_topic', {
      prm_por_id: this.myPorId,
      prm_param: this.param.prm_val,
      prm_value: this.topicValue != '' ? this.topicValue : null
    })
      .then(() => { })
      .catch(err => { console.log('err'); });
  }
}
