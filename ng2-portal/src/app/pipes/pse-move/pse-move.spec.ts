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
import {PseMovePipe} from './pse-move';


describe('PseMove Pipe', () => {

  beforeEachProviders(() => [PseMovePipe]);

/*
  it('should transform the input', inject([PseMove], (pipe:PseMove) => {
      expect(pipe.transform(true)).toBe(null);
  }));
*/
});
