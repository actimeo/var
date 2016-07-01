import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from 'primeng/primeng';

import { GroupTopicsComponent } from '../group-topics';

@Component({
  moduleId: module.id,
  selector: 'app-group-edit',
  templateUrl: 'group-edit.component.html',
  styleUrls: ['group-edit.component.css'],
  directives: [Calendar, GroupTopicsComponent]
})
export class GroupEditComponent implements OnInit {

  @Input() group: any;

  private startDate: string;
  private endDate: string;

  constructor() { }

  ngOnInit() {
  }

}
