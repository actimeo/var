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
import {Personsection} from './personsection';


describe('Personsection Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(Personsection).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
