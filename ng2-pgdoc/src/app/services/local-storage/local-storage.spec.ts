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
import {LocalStorageService} from './local-storage';


describe('LocalStorage Service', () => {

  beforeEachProviders(() => [LocalStorageService]);


  it('should ...', inject([LocalStorageService], (service:LocalStorageService) => {

  }));

});
