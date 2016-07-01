import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { I18nService } from 'ng2-i18next/ng2-i18next';

import { TopicSelectComponent } from '../topic-select';

@Component({
  moduleId: module.id,
  selector: 'app-group-topics',
  templateUrl: 'group-topics.component.html',
  styleUrls: ['group-topics.component.css'],
  directives: [TopicSelectComponent]
})
export class GroupTopicsComponent implements OnInit {

  @Input() grpId: number;
  @Input() topics: string[];

  @Output() change: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private i18next: I18nService) { }

  ngOnInit() {
  }

  deleteTopic(topic) {
    this.topics = this.topics.filter(val => val !== topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  saveTopics() {
    this.change.emit(this.topics);
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
