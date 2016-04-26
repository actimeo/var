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
import {InstitutionSelectComponent} from './institution-select.component';

describe('InstitutionSelect Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(InstitutionSelectComponent).then((fixture: ComponentFixture) => {
      fixture.detectChanges();
    });
  }));

});
