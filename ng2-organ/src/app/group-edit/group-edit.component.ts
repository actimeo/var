import { Component, OnInit, Input } from '@angular/core';
import { Button, Calendar, InputTextarea } from 'primeng/primeng';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { I18nService, I18nDirective } from 'ng2-i18next/ng2-i18next';

import { GroupTopicsComponent } from '../group-topics';

@Component({
  moduleId: module.id,
  selector: 'app-group-edit',
  templateUrl: 'group-edit.component.html',
  styleUrls: ['group-edit.component.css'],
  directives: [I18nDirective, Button, Calendar, GroupTopicsComponent, InputTextarea]
})
export class GroupEditComponent implements OnInit {

  @Input() group: any;

  private name: string;
  private topics: number[];
  private notes: string;

  private cancelVisible: boolean = false;
  private saveVisible: boolean = false;

  constructor(private pgService: PgService, private i18next: I18nService) { }

  ngOnInit() {
    this.populateForm();
  }

  private populateForm() {
    this.name = this.group.grp_name;
    this.topics = this.group.grp_topics.slice(0);
    this.notes = this.group.grp_description;
  }

  protected save() {
    this.cancelVisible = false;
    this.saveVisible = false;

    if (this.group.grp_name !== this.name) {
      this.group.grp_name = this.name;
      this.pgService.pgcall('organ', 'group_rename', {
        prm_id: this.group.grp_id,
        prm_name: this.group.grp_name
      });
    }

    this.group.grp_description = this.notes;
    this.pgService.pgcall('organ', 'group_set', {
      prm_id: this.group.grp_id,
      prm_description: this.group.grp_description
    });

    this.group.grp_topics = this.topics;
    this.pgService.pgcall('organ', 'group_set_topics', {
      prm_id: this.group.grp_id,
      prm_topics: this.group.grp_topics
    });
  }

  protected cancel() {
    this.populateForm();
    this.cancelVisible = false;
    this.saveVisible = false;
  }

  protected nameChange(val: string) {
    this.name = val;
    this.cancelVisible = true;
    this.saveVisible = true;
  }

  protected notesChange(val: string) {
    this.notes = val;
    this.cancelVisible = true;
    this.saveVisible = true;
  }

  protected topicsChange(val: number[]) {
    this.topics = val;
    this.cancelVisible = true;
    this.saveVisible = true;
  }
}
