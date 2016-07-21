/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { DataProviderTopicsService } from './data-provider-topics.service';

describe('DataProviderTopics Service', () => {
  beforeEachProviders(() => [DataProviderTopicsService]);

  it('should ...',
      inject([DataProviderTopicsService], (service: DataProviderTopicsService) => {
    expect(service).toBeTruthy();
  }));
});
