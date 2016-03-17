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
import {NavigationService} from './navigation';


describe('NavigationService Service', () => {

  beforeEachProviders(() => [NavigationService]);


  it('should ...', inject(
                       [NavigationService], (service: NavigationService) => {

                                            }));

});
