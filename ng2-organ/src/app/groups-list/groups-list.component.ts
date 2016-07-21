import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Accordion, AccordionTab } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import { GroupEditComponent } from '../group-edit';
import { DbGroup } from '../db.models/organ';

@Component({
  moduleId: module.id,
  selector: 'app-groups-list',
  templateUrl: 'groups-list.component.html',
  styleUrls: ['groups-list.component.css'],
  directives: [Accordion, AccordionTab, GroupEditComponent]
})
export class GroupsListComponent implements OnInit {

  @Input() set orgId(val: number) {
    this.intOrgId = val;
    this.groups = this.getGroups();
  }

  private intOrgId: number;

  private groups: Observable<DbGroup[]>;

  constructor(private pgService: PgService) { }

  ngOnInit() {
  }

  private getGroups(): Observable<DbGroup[]> {
    return this.pgService.pgcall('organ', 'group_list', {
      prm_org_id: this.intOrgId, prm_active_at: null
    });
  }

}
