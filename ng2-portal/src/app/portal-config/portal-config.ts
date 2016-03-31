import {Component, Input} from 'angular2/core';

import {PortalConfigElement} from '../portal-config-element/portal-config-element';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';

@Component({
  selector: 'portal-config',
  templateUrl: 'app///portal-config/portal-config.html',
  styleUrls: ['app///portal-config/portal-config.css'],
  providers: [],
  directives: [PortalConfigElement],
  pipes: []
})
export class PortalConfig {

  private params: any;

  @Input() porId: number;

  constructor(private pgService: PgService, private i18n: I18nService) { }

  ngOnInit() {
    console.log("porId1: " + this.porId);
    this.pgService.pgcall('portal', 'param_list', {})
      .then(data => this.params = data)
      .catch(err => { });
  }
}
