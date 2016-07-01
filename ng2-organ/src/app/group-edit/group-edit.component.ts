import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

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
  private topics: string[];

  constructor(private pgService: PgService) { }

  ngOnInit() {
    this.populateForm();
  }

  private populateForm() {
    this.startDate = this.group.grp_start_date;
    this.endDate = this.group.grp_end_date;
    this.topics = this.group.grp_topics.slice(0);
  }

  protected save() {
    console.log(this.group);
    this.group.grp_start_date = this.startDate;
    this.group.grp_end_date = this.endDate;
    this.group.grp_topics = this.topics;
    this.pgService.pgcall('organ', 'group_set_topics', {
      prm_id: this.group.grp_id,
      prm_topics: this.group.grp_topics
    });
    this.pgService.pgcall('organ', 'group_set', {
      prm_id: this.group.grp_id,
      prm_start_date: this.group.grp_start_date,
      prm_end_date: this.group.grp_end_date,
      prm_notes: this.group.grp_notes
    });
  }

  protected cancel() {
    this.populateForm();
  }
/*
  protected topicsChange(topics) {
    this.topics = topics;
  }*/
}
