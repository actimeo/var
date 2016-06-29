import { Component, OnInit, Input } from '@angular/core';

import { I18nService } from 'ng2-i18next/ng2-i18next';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  moduleId: module.id,
  selector: 'app-group-topics',
  templateUrl: 'group-topics.component.html',
  styleUrls: ['group-topics.component.css']
})
export class GroupTopicsComponent implements OnInit {

  @Input() grpId: number;
  @Input() topics: string[];

  constructor(private pgService: PgService, private i18next: I18nService) {}

  ngOnInit() {
  }

  deleteTopic(topic) {
    this.topics = this.topics.filter(val => val !== topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  saveTopics() {
    this.pgService.pgcall('organ', 'group_set_topics', {
      prm_id: this.grpId,
      prm_topics: this.topics
    });
  }

  topicSelected(topic) {
    this.topics.push(topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  forceTopicsChange() {
    let newtopics = this.topics.slice(0);
    this.topics = newtopics;
  }
}
