import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {Ng2VariationApp} from '../app/ng2-variation';

beforeEachProviders(() => [Ng2VariationApp]);

describe('App: Ng2Variation', () => {
  it('should have the `defaultMeaning` as 42', inject([Ng2VariationApp], (app: Ng2VariationApp) => {
    expect(app.defaultMeaning).toBe(42);
  }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life', inject([Ng2VariationApp], (app: Ng2VariationApp) => {
      expect(app.meaningOfLife()).toBe('The meaning of life is 42');
      expect(app.meaningOfLife(22)).toBe('The meaning of life is 22');
    }));
  });
});

