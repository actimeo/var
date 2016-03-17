export class Ng2PgdocPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ng2-pgdoc-app p')).getText();
  }
}
