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
import {SelectedMenus} from './selected-menus';


describe('SelectedMenus Service', () => {

  beforeEachProviders(() => [SelectedMenus]);


  it('should ...', inject([SelectedMenus], (service:SelectedMenus) => {

  }));

});
