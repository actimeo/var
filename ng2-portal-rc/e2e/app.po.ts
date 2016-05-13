export class Ng2PortalRcPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ng2-portal-rc-app h1')).getText();
  }
}
