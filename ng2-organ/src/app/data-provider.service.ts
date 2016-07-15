import { Injectable } from '@angular/core';
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { DbTopic } from './db.models/organ';

@Injectable()
export class DataProviderService {

  private topics: DbTopic[] = [];

  constructor(private pgService: PgService) {
    this.loadData();
  }

  private loadData() {
    this.pgService.pgcall('organ', 'topics_list', {})
      .then((topics: DbTopic[]) => {
        this.topics = topics;
        console.log('topics: ' + topics);
      });
  }

  /**
    * Returns the list of topics defined
    */
  public getTopics(): DbTopic[] {
    return this.topics;
  }

  /**
   * Returns the name of a specific topic
   */
  public getTopicName(id: number): string {
    return this.topics.filter(t => t.top_id === id).map(t => t.top_name)[0];
  }
}
