/* tslint:disable:no-unused-variable */
import { PgService } from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import { DbTopic } from './db.models/organ';

class MockPgService {

  private topics: DbTopic[] = [
    {
      top_id: 1,
      top_name: 'Topic 1',
      top_description: 'Desc 1'
    },
    {
      top_id: 2,
      top_name: 'Topic 2',
      top_description: 'Desc 2'
    }
  ];

  public pgcall(schema: string, method: string, args: any = {}) {
    console.log('call fake pgcall');
    return new Promise((resolve, reject) => {
      console.log('1');
      resolve(this.topics);
    });
  }
}

import {provide} from '@angular/core';
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { DataProviderService } from './data-provider.service';

describe('DataProvider Service', () => {
  beforeEachProviders(() => [
    DataProviderService,
    provide(PgService, { useClass: MockPgService })
  ]);

  it('should be built',
    inject([DataProviderService], (service: DataProviderService) => {
      expect(service).toBeTruthy();
    }));

  it('should return 2 topics',
    inject([DataProviderService], (service: DataProviderService) => {
      let topics = service.getTopics();
      console.log(topics);
    }));
/*
  it('should return good topic name',
    inject([DataProviderService], (service: DataProviderService) => {
      let name = service.getTopicName(1);
      console.log(name);
    }));*/
});
