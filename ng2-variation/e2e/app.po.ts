export class Ng2VariationPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ng2-variation-app p')).getText();
  }
}
