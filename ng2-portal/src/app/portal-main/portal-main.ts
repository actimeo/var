import {Component} from 'angular2/core';

import {
  DROPDOWN_DIRECTIVES,
  Collapse,
  ACCORDION_DIRECTIVES,
  TAB_DIRECTIVES
} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalEntity} from '../portal-entity/portal-entity';
import {PortalMainwin} from '../portal-mainwin/portal-mainwin';
import {PortalConfig} from '../portal-config/portal-config';

import {PgService} from '../services/pg-service/pg-service';
import {I18nService} from '../services/i18n/i18n';

@Component({
  selector: 'portal-main',
  styleUrls: ['app/portal-main/portal-main.css'],
  templateUrl: 'app/portal-main/portal-main.html',
  providers: [],
  directives: [
    PortalEntity, PortalMainwin, PortalConfig,
    DROPDOWN_DIRECTIVES, TAB_DIRECTIVES, Collapse, ACCORDION_DIRECTIVES
  ]
})
export class PortalMain {
  private entities: any;

  private porId: number;

  constructor(private pgService: PgService, private i18n: I18nService) { this.porId = null; }

  ngOnInit() {
    this.pgService.pgcache('portal', 'entity_list')
      .then(data => { this.entities = data; })
      .catch(err => { });
  }

  setPortalId(porId) { this.porId = porId; }
}
