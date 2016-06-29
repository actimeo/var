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
import {PgService, UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';
import {I18nService} from 'ng2-i18next/ng2-i18next';
import {AlertsService} from 'variation-toolkit/variation-toolkit';

import {HTTP_PROVIDERS} from 'angular2/http';

describe('InstitutionSelect Component', () => {

  beforeEachProviders((): any[] => [
    HTTP_PROVIDERS, PgService, UserService, I18nService, AlertsService
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb.createAsync(InstitutionSelectComponent).then((fixture: ComponentFixture) => {
      fixture.detectChanges();
    });
  }));

});
