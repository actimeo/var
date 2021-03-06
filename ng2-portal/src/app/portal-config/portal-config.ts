import {Component, Input, OnInit} from 'angular2/core';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {PortalConfigElement} from '../portal-config-element/portal-config-element';


@Component({
  selector: 'portal-config',
  templateUrl: 'app///portal-config/portal-config.html',
  styleUrls: ['app///portal-config/portal-config.css'],
  providers: [],
  directives: [PortalConfigElement, I18nDirective],
  pipes: []
})
export class PortalConfig implements OnInit {

  private params: string[];

  @Input() porId: number;

  constructor(private pgService: PgService, private i18n: I18nService) { }

  ngOnInit() {
    this.pgService.pgcall('portal', 'param_list', {})
      .then((data: string[]) => this.params = data)
      .catch(err => { });
  }
}
