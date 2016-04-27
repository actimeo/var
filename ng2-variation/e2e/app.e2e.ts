import { Ng2VariationPage } from './app.po';

describe('ng2-variation App', function() {
  let page: Ng2VariationPage;

  beforeEach(() => {
    page = new Ng2VariationPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ng2-variation Works!');
  });
});
