import {
  beforeEachProviders,
  describe,
  ddescribe,
  expect,
  iit,
  it,
  inject,
  injectAsync,
  ComponentFixture,
  TestComponentBuilder
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {InstitutionMainComponent} from './institution-main.component';

describe('InstitutionMain Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(InstitutionMainComponent).then((fixture: ComponentFixture) => {
      fixture.detectChanges();
    });
  }));

});
