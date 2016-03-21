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
import {FootertipService} from './footertip';


describe('Footertip Service', () => {

  beforeEachProviders(() => [FootertipService]);


  it('should ...', inject(
                       [FootertipService], (service: FootertipService) => {

                                           }));

});
