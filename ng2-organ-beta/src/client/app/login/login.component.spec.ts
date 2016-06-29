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
import {LoginComponent} from './login.component';
import {RouteRegistry, ROUTER_PRIMARY_COMPONENT, Router} from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {Ng2OrganApp} from '../ng2-organ';

describe('Login Component', () => {

  beforeEachProviders(() => [
    RouteRegistry,
    provide(Location, { useClass: SpyLocation }),
    provide(ROUTER_PRIMARY_COMPONENT, { useValue: Ng2OrganApp }),
    provide(Router, { useClass: RootRouter })
  ]);


  it('should ...', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb.createAsync(LoginComponent).then((fixture: ComponentFixture) => {
      fixture.detectChanges();
    });
  }));

});
