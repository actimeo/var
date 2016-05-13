import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Ng2PortalRcAppComponent } from '../app/ng2-portal-rc.component';

beforeEachProviders(() => [Ng2PortalRcAppComponent]);

describe('App: Ng2PortalRc', () => {
  it('should create the app',
      inject([Ng2PortalRcAppComponent], (app: Ng2PortalRcAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'ng2-portal-rc works!\'',
      inject([Ng2PortalRcAppComponent], (app: Ng2PortalRcAppComponent) => {
    expect(app.title).toEqual('ng2-portal-rc works!');
  }));
});
