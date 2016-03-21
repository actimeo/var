import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {PmeMovePipe} from './pme-move';


describe('PmeMove Pipe', () => {

  beforeEachProviders(() => [PmeMovePipe]);

});
