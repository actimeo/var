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
import {Groupby} from './groupby';


describe('Groupby Pipe', () => {

  beforeEachProviders(() => [Groupby]);


  it('should transform the input',
     inject([Groupby], (pipe: Groupby) => { expect(pipe.transform(true)).toBe(null); }));

});
