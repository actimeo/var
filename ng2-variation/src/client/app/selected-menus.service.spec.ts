import {
  beforeEachProviders,
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {SelectedMenusService} from './selected-menus.service';

describe('SelectedMenus Service', () => {

  beforeEachProviders(() => [SelectedMenusService]);
  
  it('should ...', inject([SelectedMenusService], (service: SelectedMenusService) => {

  }));

});
