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

  private intTopics: string[];
  @Input() get topics(): string[]{
    return this.intTopics;
  }
  set topics(val: string[]) {
    this.intTopics = val;
  }
  @Output() topicsChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private i18next: I18nService) { }

  ngOnInit() {
  }

  deleteTopic(topic) {
    this.intTopics = this.intTopics.filter(val => val !== topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  saveTopics() {
    this.topicsChange.emit(this.intTopics);
  }

  topicSelected(topic) {
    this.intTopics.push(topic);
    this.saveTopics();
    this.forceTopicsChange();
  }

  forceTopicsChange() {
    let newtopics = this.intTopics.slice(0);
    this.intTopics = newtopics;
  }
}
