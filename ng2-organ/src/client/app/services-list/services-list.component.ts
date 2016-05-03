import {Component, OnInit, Input} from 'angular2/core';

import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {GroupsListComponent} from '../groups-list/index';
import {ServiceTopicsComponent} from '../service-topics/index';

@Component({
  selector: 'services-list',
  templateUrl: 'app///services-list/services-list.component.html',
  styleUrls: ['app///services-list/services-list.component.css'],
  directives: [ACCORDION_DIRECTIVES, GroupsListComponent, ServiceTopicsComponent]
})
export class ServicesListComponent implements OnInit {

  @Input() set insId(val: number) {
    this.intInsId = val;
    this.reloadData();
  }

  private services: any;
  private intInsId: number;

  constructor(private pgService: PgService) { }

  ngOnInit() {
  }

  private reloadData() {
    this.pgService.pgcall('organ', 'service_list', { prm_ins_id: this.intInsId })
      .then(data => {
        this.services = data;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
