import { Ng2PortalRcPage } from './app.po';

describe('ng2-portal-rc App', function() {
  let page: Ng2PortalRcPage;

  beforeEach(() => {
    page = new Ng2PortalRcPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ng2-portal-rc works!');
  });
});
