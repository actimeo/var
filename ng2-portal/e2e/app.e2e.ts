import { Ng2PortalPage } from './app.po';

describe('ng2-portal App', function() {
  let page: Ng2PortalPage;

  beforeEach(() => {
    page = new Ng2PortalPage();
  })

  it('should display login form', () => {
    page.navigateTo();
    expect(page.getLabelText(1)).toEqual('Identifiant');
    expect(page.getLabelText(2)).toEqual('Mot de passe');
  });

  it('should login', () => {
    page.enterLogin('portaluser');
    page.enterPwd('portal/user');
    page.getFormLogin().submit();
    browser.driver.sleep(100);
    expect(page.getBrandText()).toEqual('Variation Édition de portails');
  });

  it('should add portal', () => {
    page.getSelectPortalButton().click();
    page.getAddPortal().click();

    page.getPortalnameInput().sendKeys('1p');
    page.getPortalnameForm().submit();
    expect(page.getSelectPortalButton().getText()).toEqual('1p');
  });

  it('should delete portal 1p', () => {
    page.getSelectPortalButton().click();
    element(by.css('portal-select ul li:first-child')).click();
    page.getSelectPortalButton().click();
    page.getDeletePortal().click();
    browser.driver.sleep(3000);
  });
});
