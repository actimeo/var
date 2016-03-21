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
import {PersonmenuAdd} from './personmenu-add';


describe('PersonmenuAdd Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       return tcb.createAsync(PersonmenuAdd).then((fixture) => { fixture.detectChanges(); });
     }));

});
