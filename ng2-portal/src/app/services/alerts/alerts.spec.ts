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
import {AlertsService} from './alerts';


describe('Alerts Service', () => {

  beforeEachProviders(() => [AlertsService]);


  it('should ...', inject(
                       [AlertsService], (service: AlertsService) => {

                                        }));

});
