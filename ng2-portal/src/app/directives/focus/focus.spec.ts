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
import {FocusDirective} from './focus';


@Component({selector: 'test-component', template: `<div focus></div>`})
class TestComponent {
}

describe('Focus Directive', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       return tcb.createAsync(TestComponent).then((fixture) => { fixture.detectChanges(); });
     }));

});
