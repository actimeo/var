import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { I18nDirective, I18nService } from 'ng2-i18next/ng2-i18next';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { Dialog, Button } from 'primeng/primeng';

import { DlgSelecttopicComponent } from '../dlg-selecttopic';
import { DbTopic } from '../db.models/organ';

@Component({
  moduleId: module.id,
  selector: 'app-topic-select',
  templateUrl: 'topic-select.component.html',
  styleUrls: ['topic-select.component.css'],
  directives: [DlgSelecttopicComponent, I18nDirective, Dialog, Button]
})
export class TopicSelectComponent implements OnInit {

  @Input() set ignoreTopics(val: number[]) {
    this.intIgnoreTopics = val;
    this.filterTopics();
  }

  @Output() selected = new EventEmitter<string>();

  private intIgnoreTopics: number[];
  private topics: Observable<DbTopic[]>;
  private originalTopics: Observable<DbTopic[]> = null;

  display: boolean = false;

  constructor(private i18next: I18nService, private pgService: PgService) { }

  ngOnInit() {
    this.topics = this.getTopics();
  }

  private getTopics(): Observable<DbTopic[]> {
    return this.pgService.pgcall('organ', 'topics_list', {});
  }

  private filterTopics() {
    if (this.topics) {
//      this.topics = this.originalTopics.filter(val => this.intIgnoreTopics.indexOf(val.top_id) === -1);
    }
  }

  showDialog() {
    this.display = true;
  }

  protected topicSelected(topic: string) {
    this.selected.emit(topic);
    this.filterTopics();
  }
}
