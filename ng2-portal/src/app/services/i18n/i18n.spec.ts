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
import {I18nService} from './i18n';


describe('I18n Service', () => { beforeEachProviders(() => [I18nService]); });
