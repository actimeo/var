export class Ng2PortalPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ng2-portal-app p')).getText();
  }
}
