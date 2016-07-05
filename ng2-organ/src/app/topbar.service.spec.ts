/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { TopbarService } from './topbar.service';

describe('Topbar Service', () => {
  beforeEachProviders(() => [TopbarService]);

  it('should ...',
      inject([TopbarService], (service: TopbarService) => {
    expect(service).toBeTruthy();
  }));
});
