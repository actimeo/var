import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {Ng2OrganApp} from '../app/ng2-organ';

beforeEachProviders(() => [Ng2OrganApp]);

describe('App: Ng2Organ', () => {
  it('should have the `defaultMeaning` as 42', inject([Ng2OrganApp], (app: Ng2OrganApp) => {
    expect(app.defaultMeaning).toBe(42);
  }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life', inject([Ng2OrganApp], (app: Ng2OrganApp) => {
      expect(app.meaningOfLife()).toBe('The meaning of life is 42');
      expect(app.meaningOfLife(22)).toBe('The meaning of life is 22');
    }));
  });
});

