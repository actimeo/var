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
import {Serial} from './serial';


describe('Serial Pipe', () => {

  beforeEachProviders(() => [Serial]);


  it('should transform the input', inject([Serial], (pipe:Serial) => {
      expect(pipe.transform(true)).toBe(null);
  }));

});
