import {Component, OnInit, Input} from 'angular2/core';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {ServiceTopicsComponent} from '../service-topics/index';

@Component({
  selector: 'groups-list',
  templateUrl: 'app///groups-list/groups-list.component.html',
  styleUrls: ['app///groups-list/groups-list.component.css'],
  directives: [ACCORDION_DIRECTIVES, ServiceTopicsComponent]
})
export class GroupsListComponent implements OnInit {
  @Input() set insId(val: number) {
    this.intInsId = val;
    this.reloadData();
  }
  private intInsId: number;

  private groups: any;

  constructor(private pgService: PgService) { }

  ngOnInit() { }

  private reloadData() {
    this.pgService.pgcall('organ', 'group_list', {
      prm_org_id: this.intInsId, prm_active_at: null
    })
      .then(data => {
        this.groups = data;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
