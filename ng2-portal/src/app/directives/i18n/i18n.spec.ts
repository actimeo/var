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
import {provide, Component} from 'angular2/core';
import {I18nDirective} from './i18n';


@Component({
  selector: 'test-component',
  template: `<div i18n></div>`
})
class TestComponent {}

describe('I18n Directive', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
