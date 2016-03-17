import { Ng2PgdocPage } from './app.po';

describe('ng2-pgdoc App', function() {
  let page: Ng2PgdocPage;

  beforeEach(() => {
    page = new Ng2PgdocPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ng2-pgdoc Works!');
  });
});
