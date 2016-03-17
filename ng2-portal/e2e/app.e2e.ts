import { Ng2PortalPage } from './app.po';

describe('ng2-portal App', function() {
  let page: Ng2PortalPage;

  beforeEach(() => {
    page = new Ng2PortalPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ng2-portal Works!');
  });
});
