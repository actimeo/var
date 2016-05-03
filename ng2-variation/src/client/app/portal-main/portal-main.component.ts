import {Component, Input} from 'angular2/core';

import {
  DROPDOWN_DIRECTIVES, CollapseDirective,
  ACCORDION_DIRECTIVES, TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nService, I18nDirective} from 'ng2-i18next/ng2-i18next';

import {PortalMainwinComponent} from '../portal-mainwin/index';
/*
import {PortalEntity} from '../portal-entity/portal-entity';
import {PortalMainwin} from '../portal-mainwin/portal-mainwin';
import {PortalConfig} from '../portal-config/portal-config';
*/

@Component({
  selector: 'portal-main',
  styleUrls: ['app///portal-main/portal-main.component.css'],
  templateUrl: 'app///portal-main/portal-main.component.html',
  providers: [],
  directives: [
    //PortalEntity, PortalConfig, 
    PortalMainwinComponent,
    I18nDirective,
    DROPDOWN_DIRECTIVES, TAB_DIRECTIVES, CollapseDirective, ACCORDION_DIRECTIVES
  ]
})
export class PortalMainComponent {
  private intPorId: number;
  @Input()
  set porId(id: number) {
    this.intPorId = id;
  }

  constructor(private i18n: I18nService) { this.porId = null; }
}
