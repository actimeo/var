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
import {PortalMainwinComponent} from './portal-mainwin.component';

describe('PortalMainwin Component', () => {

  beforeEachProviders((): any[] => []);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(PortalMainwinComponent).then((fixture: ComponentFixture) => {
      fixture.detectChanges();
    });
  }));

});
