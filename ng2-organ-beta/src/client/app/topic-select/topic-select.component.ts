import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {I18nDirective, I18nService} from 'ng2-i18next/ng2-i18next';
import {PgService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Component({
  selector: 'topic-select',
  templateUrl: 'app///topic-select/topic-select.component.html',
  styleUrls: ['app///topic-select/topic-select.component.css'],
  directives: [DROPDOWN_DIRECTIVES, I18nDirective]
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
}
