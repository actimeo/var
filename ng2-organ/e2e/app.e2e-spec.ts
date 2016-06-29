import { Ng2OrganPage } from './app.po';

describe('ng2-organ App', function() {
  let page: Ng2OrganPage;

  beforeEach(() => {
    page = new Ng2OrganPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
