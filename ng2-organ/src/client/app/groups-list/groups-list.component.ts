import {Component, OnInit, Input} from 'angular2/core';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'groups-list',
  templateUrl: 'app///groups-list/groups-list.component.html',
  styleUrls: ['app///groups-list/groups-list.component.css']
})
export class GroupsListComponent implements OnInit {

  @Input() serId: number;

  private groups: any;

  constructor(private pgService: PgService) { }

  ngOnInit() {
    this.pgService.pgcall('organ', 'service_group_list', {
      prm_ser_id: this.serId, prm_active_at: null
    })
      .then(data => {
        this.groups = data;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
