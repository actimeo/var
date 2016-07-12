import { Injectable } from '@angular/core';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { DbTopic } from './db.models/organ';

@Injectable()
export class DataProviderService {

  private topics: any[];

  constructor(private pgService: PgService) { }

  loadData() {
    this.pgService.pgcall('organ', 'topics_list', {})
      .then((topics: DbTopic[]) => {
        this.topics = topics;
        console.log(topics);
      });
  }

  getTopicName(id: number): string {
    return this.topics.filter(t => t.top_id === id).map(t => t.top_name)[0];
  }
}
