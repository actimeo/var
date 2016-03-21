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
import {Mainmenu} from './mainmenu';


describe('Mainmenu Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       return tcb.createAsync(Mainmenu).then((fixture) => { fixture.detectChanges(); });
     }));

});
