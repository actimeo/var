import { Component, OnInit, Input } from '@angular/core';
import { Accordion, AccordionTab } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import { GroupEditComponent } from '../group-edit';

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
    this.reloadData();
  }

  private intOrgId: number;

  private groups: any;

  constructor(private pgService: PgService) { }

  ngOnInit() {
  }

  private reloadData() {
    this.pgService.pgcall('organ', 'group_list', {
      prm_org_id: this.intOrgId, prm_active_at: null
    })
      .then(data => {
        this.groups = data;
        console.log(this.groups);
      })
      .catch(err => {
        console.log(err);
      });
  }

}
