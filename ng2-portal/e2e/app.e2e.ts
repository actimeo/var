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
personsection *
 - add *
 - rename *
 - delete *
 - move *
personmenu *
 - add *
 - rename *
 - delete *
 - move *
 */
describe('ng2-portal App', function() {
  let page: Ng2PortalPage;

  beforeEach(() => {
    page = new Ng2PortalPage();
  });

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
    page.getMainWindowTab().click();
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
  // start
  it('should add section s1', () => {
    page.getFirstEntityTab().click();
    page.getAddPersonSection().click();
    page.getPersonsectionInput().sendKeys('s1');
    page.getPersonsectionForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonsectionsCountIs(1), 30000);
    expect(page.getPersonsectionsCount()).toEqual(1);
  });

  it('first section title should be s1', () => {
    expect(page.getVisiblePersonsectionTitle().getText()).toEqual('s1');
  });

  it('should add section s2', () => {
    page.getAddPersonSection().click();
    page.getPersonsectionInput().sendKeys('s2');
    page.getPersonsectionForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonsectionsCountIs(2), 30000);
    expect(page.getPersonsectionsCount()).toEqual(2);
  });

  it('should rename first Person section to s3', () => {
    page.getVisiblePersonSection().click();
    page.getVisibleRenamePersonsection().click();
    page.getVisiblePersonsectionInput().clear();
    page.getVisiblePersonsectionInput().sendKeys('s3');
    page.getVisiblePersonsectionForm().submit();
    browser.driver.sleep(100);
    expect(page.getVisiblePersonsectionTitle().getText()).toEqual('s3');
  });

  it('should move first Person section after second', () => {
    page.getVisiblePersonSection().click();
    page.getVisibleMovePersonsection().click();
    page.findMovePersonsectionOption().sendKeys('À la fin');
    browser.driver.sleep(100);
    page.getVisiblePersonsectionMoveForm().submit();
    browser.driver.sleep(500);
    expect(page.getVisiblePersonsectionTitle().getText()).toEqual('s2');
  });

  it('should delete first section', () => {
    page.getVisiblePersonSection().click();
    page.getVisibleDeletePersonsection().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonsectionsCountIs(1), 30000);
    expect(page.getPersonsectionsCount()).toEqual(1);
  });

  it('should add first Personmenu m1', () => {
    page.getVisiblePersonSection().click();
    page.getAddPersonmenu().click();
    page.getPersonmenuInput().sendKeys('m1');
    page.getPersonmenuForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonmenusCountIs(1), 30000);
    expect(page.getPersonmenusCount()).toEqual(1);

  });

  it('first Personmenu title should be m1', () => {
    expect(page.getVisiblePersonmenuTitle().getText()).toEqual('m1');
  });

  it('should add Personmenu m2', () => {
    page.getAddPersonmenu().click();
    page.getPersonmenuInput().sendKeys('m2');
    page.getPersonmenuForm().submit();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonmenusCountIs(2), 30000);
    expect(page.getPersonmenusCount()).toEqual(2);
  });

  it('should rename first Person menu to m3', () => {
    page.getVisiblePersonmenuView().click();
    page.getVisiblePersonmenuRename().click();
    page.getVisiblePersonmenuInput().clear();
    page.getVisiblePersonmenuInput().sendKeys('m3');
    page.getVisiblePersonmenuForm().submit();
    browser.driver.sleep(100);
    expect(page.getVisiblePersonmenuTitle().getText()).toEqual('m3');
  });

  it('should move first Person menu after second', () => {
    page.getVisiblePersonmenuView().click();
    page.getVisiblePersonmenuMove().click();
    page.findMovePersonmenuOption().sendKeys('À la fin');
    browser.driver.sleep(100);
    page.findMovePersonmenuForm().submit();
    browser.driver.sleep(500);
    expect(page.getVisiblePersonmenuTitle().getText()).toEqual('m2');
  });
/*
  it('should set view title for first main menu of main section', () => {
    page.getMainWindowTab().click();
    page.getFirstSection().click();
    page.getVisibleMainmenuTitle().click();
    page.getMainviewTitle().sendKeys('ttl');
    page.getMainviewForm().submit();
    expect(page.getMainviewH1().getText()).toEqual('ttl');
  });

  it('should rename title do t2', () => {
    page.getMainviewEdit().click();
    page.getMainviewTitle().clear();
    page.getMainviewTitle().sendKeys('t2');
    page.getMainviewForm().submit();
    expect(page.getMainviewH1().getText()).toEqual('t2');
  });

  it('should delete mainview', () => {
    page.getMainviewDelete().click();
  });
*/
  it('should delete first mainmenu', () => {
    page.getMainWindowTab().click();

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

  it('should delete first Personmenu', () => {
    page.getFirstEntityTab().click();
    browser.driver.sleep(100);
    page.getFirstSection().click();
    browser.driver.sleep(100);

    page.getVisiblePersonmenuView().click();
    page.getVisiblePersonmenuDelete().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonmenusCountIs(1), 30000);
    expect(page.getPersonmenusCount()).toEqual(1);
  });

  it('should delete first Personmenu again', () => {
    page.getVisiblePersonmenuView().click();
    page.getVisiblePersonmenuDelete().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonmenusCountIs(0), 30000);
    expect(page.getPersonmenusCount()).toEqual(0);
  });

  it('should delete first section again', () => {
    page.getVisiblePersonSection().click();
    page.getVisibleDeletePersonsection().click();
    browser.driver.sleep(100);
    browser.driver.wait(page.getPersonsectionsCountIs(0), 30000);
    expect(page.getPersonsectionsCount()).toEqual(0);
  });

  it('should delete portal 1p', () => {
    page.getSelectPortalButton().click();
    element(by.css('portal-select ul li:first-child')).click();
    page.getSelectPortalButton().click();
    page.getDeletePortal().click();
    browser.driver.sleep(3000);
  });
});
