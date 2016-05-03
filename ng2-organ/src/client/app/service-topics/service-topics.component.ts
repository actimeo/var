import {Component, OnInit, Input} from 'angular2/core';

import {I18nService} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

import {TopicSelectComponent} from '../topic-select/index';

@Component({
  selector: 'service-topics',
  templateUrl: 'app/service-topics/service-topics.component.html',
  styleUrls: ['app/service-topics/service-topics.component.css'],
  directives: [TopicSelectComponent]
})
export class ServiceTopicsComponent implements OnInit {

  @Input() serId: number;
  @Input() topics: string[];

  constructor(private pgService: PgService, private i18next: I18nService) { }

  ngOnInit() {
 }

  deleteTopic(topic) {
    this.topics = this.topics.filter(val => val != topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  saveTopics() {
    this.pgService.pgcall('organ', 'service_set_topics', {
      prm_id: this.serId,
      prm_topics: this.topics
    });
  }

  topicSelected(topic) {
    this.topics.push(topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  forceTopicsChange() {
    var newtopics = this.topics.slice(0);
    this.topics = newtopics;
  }
}
