import { Ng2PortalPage } from './app.po';

/*
portal *
 - add *
 - rename *
 - delete *
mainsection *
 - add *
 - rename *
 - delete *
 - move *
mainmenu *
 - add *
 - rename *
 - delete *
 - move *
personsection
 - add
 - rename
 - delete
 - move
personmenu
 - add
 - rename
 - delete
 - move
 */
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

  it('should add section s1', () => {
    page.getAddMainSection().click();
    page.getMainsectionInput().sendKeys('s1');
    page.getMainsectionForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainsectionsCountIs(1), 30000);
    expect(page.getMainsectionsCount()).toEqual(1);
  });

  it('first section title should be s1', () => {
    expect(page.getVisibleMainsectionTitle().getText()).toEqual('s1');
  });

  it('should add section s2', () => {
    page.getAddMainSection().click();
    page.getMainsectionInput().sendKeys('s2');
    page.getMainsectionForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainsectionsCountIs(2), 30000);
    expect(page.getMainsectionsCount()).toEqual(2);
  });

  it('should rename first main section to s3', () => {
    page.getVisibleMainSection().click();
    page.getVisibleRenameMainsection().click();
    page.getVisibleMainsectionInput().clear();
    page.getVisibleMainsectionInput().sendKeys('s3');
    page.getVisibleMainsectionForm().submit();
    browser.driver.sleep(100);
    expect(page.getVisibleMainsectionTitle().getText()).toEqual('s3');
  });

  it('should move first main section after second', () => {
    page.getVisibleMainSection().click();
    page.getVisibleMoveMainsection().click();
    page.findMoveMainsectionOption().sendKeys('À la fin');
    browser.driver.sleep(100);
    page.getVisibleMainsectionMoveForm().submit();
    browser.driver.sleep(500);
    expect(page.getVisibleMainsectionTitle().getText()).toEqual('s2');
  });

  it('should delete first section', () => {
    page.getVisibleMainSection().click();
    page.getVisibleDeleteMainsection().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainsectionsCountIs(1), 30000);
    expect(page.getMainsectionsCount()).toEqual(1);
  });

  it('should add first mainmenu m1', () => {
    page.getVisibleMainSection().click();
    page.getAddMainmenu().click();
    page.getMainmenuInput().sendKeys('m1');
    page.getMainmenuForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainmenusCountIs(1), 30000);
    expect(page.getMainmenusCount()).toEqual(1);

  });

  it('first mainmenu title should be m1', () => {
    expect(page.getVisibleMainmenuTitle().getText()).toEqual('m1');
  });

  it('should add mainmenu m2', () => {
    page.getAddMainmenu().click();
    page.getMainmenuInput().sendKeys('m2');
    page.getMainmenuForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainmenusCountIs(2), 30000);
    expect(page.getMainmenusCount()).toEqual(2);
  });

  it('should rename first main menu to m3', () => {
    page.getVisibleMainmenuView().click();
    page.getVisibleMainmenuRename().click();
    page.getVisibleMainmenuInput().clear();
    page.getVisibleMainmenuInput().sendKeys('m3');
    page.getVisibleMainmenuForm().submit();
    browser.driver.sleep(100);
    expect(page.getVisibleMainmenuTitle().getText()).toEqual('m3');
  });

  it('should move first main menu after second', () => {
    page.getVisibleMainmenuView().click();
    page.getVisibleMainmenuMove().click();
    page.findMoveMainmenuOption().sendKeys('À la fin');
    browser.driver.sleep(100);
    page.findMoveMainmenuForm().submit();
    browser.driver.sleep(500);
    expect(page.getVisibleMainmenuTitle().getText()).toEqual('m2');
  });

  it('should delete first mainmenu', () => {
    page.getVisibleMainmenuView().click();
    page.getVisibleMainmenuDelete().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainmenusCountIs(1), 30000);
    expect(page.getMainmenusCount()).toEqual(1);
  });

  it('should delete first mainmenu again', () => {
    page.getVisibleMainmenuView().click();
    page.getVisibleMainmenuDelete().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainmenusCountIs(0), 30000);
    expect(page.getMainmenusCount()).toEqual(0);
  });

  it('should delete first section again', () => {
    page.getVisibleMainSection().click();
    page.getVisibleDeleteMainsection().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getMainsectionsCountIs(0), 30000);
    expect(page.getMainsectionsCount()).toEqual(0);
  });

  it('should rename portal 1p to 1po', () => {
    page.getSelectPortalButton().click();
    page.getRenamePortal().click();
    page.getPortalnameInput().clear();
    page.getPortalnameInput().sendKeys('1po');
    page.getPortalnameForm().submit();
    browser.driver.sleep(100);
    expect(page.getSelectPortalButton().getText()).toEqual('1po');
  });

  // person section / menu

  it('should delete portal 1p', () => {
    page.getSelectPortalButton().click();
    element(by.css('portal-select ul li:first-child')).click();
    page.getSelectPortalButton().click();
    page.getDeletePortal().click();
    browser.driver.sleep(3000);
  });
});
