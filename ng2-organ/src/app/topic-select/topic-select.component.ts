import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { I18nDirective, I18nService } from 'ng2-i18next/ng2-i18next';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { Dialog, Button } from 'primeng/primeng';

@Component({
  moduleId: module.id,
  selector: 'app-topic-select',
  templateUrl: 'topic-select.component.html',
  styleUrls: ['topic-select.component.css'],
  directives: [I18nDirective, Dialog, Button]
})
export class TopicSelectComponent implements OnInit {

  @Input() set ignoreTopics(val: string[]) {
    console.log('ignore: ' + val);
    this.intIgnoreTopics = val;
    this.filterTopics();
  }

  @Output() selected = new EventEmitter<string>();

  private intIgnoreTopics: string[];
  private topics: any;
  private originalTopics = null;

  display: boolean = false;

  constructor(private i18next: I18nService, private pgService: PgService) { }

  ngOnInit() {
    this.pgService.pgcall('portal', 'topics_list', {})
      .then(data => {
        this.topics = data;
        this.originalTopics = data;
        this.filterTopics();
      })
      .catch(err => console.log(err));
  }

  onTopicSelected(topic) {
    this.selected.emit(topic);
  }

  private filterTopics() {
    if (this.topics) {
      this.topics = this.originalTopics.filter(val => this.intIgnoreTopics.indexOf(val) == -1);
    }
  }

  showDialog() {
    this.display = true;
  }

}