export class Ng2PortalPage {
  navigateTo() {
    return browser.get('/');
  }

  getLabelText(n) {
    return element(by.css('login-cmp form > div:nth-of-type(' + n + ') > label')).getText();
  }

  enterLogin(s: string) {
    element(by.id('username')).sendKeys(s);
  }

  enterPwd(s: string) {
    element(by.id('password')).sendKeys(s);
  }

  getFormLogin() {
    return element(by.css('login-cmp form'));
  }

  getBrandText() {
    return element(by.css('home-cmp .navbar-brand')).getText();
  }

  getSelectPortalButton() {
    return element(by.id('select-portal'));
  }
  getAddPortal() {
    return element(by.css('portal-select .portaladd'));
  }
  getDeletePortal() {
    return element(by.css('portal-select .portaldelete'));
  }
  getRenamePortal() {
    return element(by.css('portal-select .portalrename'));
  }
  getPortalnameInput() {
    return element(by.css('portal-select form input'));
  }
  getPortalnameForm() {
    return element(by.css('portal-select form'));
  }

  getAddMainSection() {
    return element(by.css('mainsection-add > div > span > button'));
  }
  getMainsectionInput() {
    return element(by.css('mainsection-add form input'));
  }
  getMainsectionForm() {
    return element(by.css('mainsection-add form'));
  }
  getMainsectionsCount() {
    return element.all(by.css('portal-mainwin accordion-group')).count();
  }
  getMainsectionsCountIs(v) {
    return element.all(by.css('portal-mainwin accordion-group')).count().then(value => value == v);
  }

  getVisibleMainSection() {
    return element(by.css('portal-mainwin accordion-group:first-child'));
  }

  getVisibleDeleteMainsection() {
    return element.all(by.css('mainsection .mainsectiondelete'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getVisibleRenameMainsection() {
    return element.all(by.css('mainsection .mainsectionrename'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getVisibleMainsectionTitle() {
    return element.all(by.css('portal-mainwin accordion-group h4'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getVisibleMainsectionInput() {
    return element.all(by.css('portal-mainwin input.mainsectionrename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getVisibleMainsectionForm() {
    return element.all(by.css('form.mainsectionrename'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getVisibleMoveMainsection() {
    return element.all(by.css('button.mainsectionmove'))
      .filter(e => e.isDisplayed())
      .first();
  }
  findMoveMainsectionOption() {
    return element.all(by.css('portal-mainwin select.mainsectionmove'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getVisibleMainsectionMoveForm() {
    return element.all(by.css('portal-mainwin form.mainsectionmove'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getAddMainmenu() {
    return element.all(by.css('portal-mainwin button.mainmenuadd'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getMainmenuInput() {
    return element.all(by.css('portal-mainwin input.mainmenuadd'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getMainmenuForm() {
    return element(by.css('portal-mainwin form.mainmenuadd'));
  }
  getMainmenusCount() {
    return element.all(by.css('portal-mainwin mainsection mainmenu'))
      .filter(e => e.isDisplayed())
      .count();
  }
  getMainmenusCountIs(v) {
    return element.all(by.css('portal-mainwin mainsection mainmenu'))
      .filter(e => e.isDisplayed())
      .count()
      .then(value => value == v);
  }
  getVisibleMainmenuTitle() {
    return element.all(by.css('portal-mainwin mainmenu:first-child span:first-child')).first();
  }

  getVisibleMainmenuView() {
    return element.all(by.css('portal-mainwin button.mainmenuview'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getVisibleMainmenuRename() {
    return element.all(by.css('portal-mainwin button.mainmenurename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getVisibleMainmenuInput() {
    return element.all(by.css('portal-mainwin input.mainmenurename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getVisibleMainmenuForm() {
    return element.all(by.css('portal-mainwin form.mainmenurename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getVisibleMainmenuMove() {
    return element.all(by.css('portal-mainwin button.mainmenumove'))
      .filter(e => e.isDisplayed())
      .first();
  }
  findMoveMainmenuOption() {
    return element.all(by.css('portal-mainwin select.mainmenumove'))
      .filter(e => e.isDisplayed())
      .first();
  }
  findMoveMainmenuForm() {
    return element.all(by.css('portal-mainwin form.mainmenumove'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getVisibleMainmenuDelete() {
    return element.all(by.css('portal-mainwin button.mainmenudelete'))
      .filter(e => e.isDisplayed())
      .first();
  }
}
