import {Component, OnInit, Input} from 'angular2/core';

import {
  DROPDOWN_DIRECTIVES, CollapseDirective,
  ACCORDION_DIRECTIVES, TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {PortalEntity} from '../portal-entity/portal-entity';
import {PortalMainwin} from '../portal-mainwin/portal-mainwin';
import {PortalConfig} from '../portal-config/portal-config';


@Component({
  selector: 'portal-main',
  styleUrls: ['app/portal-main/portal-main.css'],
  templateUrl: 'app/portal-main/portal-main.html',
  providers: [],
  directives: [
    PortalEntity, PortalMainwin, PortalConfig, I18nDirective,
    DROPDOWN_DIRECTIVES, TAB_DIRECTIVES, CollapseDirective, ACCORDION_DIRECTIVES
  ]
})
export class PortalMain implements OnInit {
  private intPorId: number;
  @Input()
  set porId(id: number) {
    this.intPorId = id;
  }

  private entities: string[];

  private ones = [1];

  constructor(private pgService: PgService, private i18n: I18nService) { this.porId = null; }

  ngOnInit() {
    this.pgService.pgcache('portal', 'entity_list')
      .then((data: string[]) => { this.entities = data; })
      .catch(err => { });
  }
}
