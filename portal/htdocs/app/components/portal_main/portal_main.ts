import {Component} from 'angular2/core';

import {
  DROPDOWN_DIRECTIVES,
  Collapse,
  ACCORDION_DIRECTIVES,
  TAB_DIRECTIVES,
  Dropdown
} from 'ng2-bootstrap/ng2-bootstrap';

import {PortalEntity} from './../portal_entity/portal_entity';
import {PortalMainwin} from './../portal_mainwin/portal_mainwin';
import {PortalService} from './../../services/portal_service';
import {I18nService} from '../../services/i18n';

@Component({
  selector: 'portal-main',
  styles: [`
	     #leftbar { width: 240px; }
	     `],
  templateUrl: './app/components/portal_main/portal_main.html',
  providers: [PortalService],
  directives: [
    PortalEntity, PortalMainwin, DROPDOWN_DIRECTIVES, TAB_DIRECTIVES, Collapse, ACCORDION_DIRECTIVES
  ]
})
export class PortalMain {
  private entities: any;

  private por_id: number;

  constructor(private _portalService: PortalService, private i18n: I18nService) {
    this.por_id = null;
  }

  ngOnInit() {
    this._portalService.listEntities()
        .then(data => {
          console.log("listEntities: " + data);
          this.entities = data;
        })
        .catch(err => { console.log("err " + err); });
  }

  setPortalId(por_id) {
    this.por_id = por_id;
    console.log("set portal id: " + por_id);
  }
}
