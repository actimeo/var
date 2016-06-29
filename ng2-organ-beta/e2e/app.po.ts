export class Ng2OrganPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ng2-organ-app p')).getText();
  }
}
