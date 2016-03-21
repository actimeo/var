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
import {MmeMovePipe} from './mme-move';


describe('MmeMove Pipe', () => {

  beforeEachProviders(() => [MmeMovePipe]);

});
