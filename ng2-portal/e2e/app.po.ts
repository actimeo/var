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

  getFirstMainSection() {
    return element(by.css('portal-mainwin accordion-group:first-child'));
  }

  getFirstDeleteMainsection() {
    return element.all(by.css('mainsection .mainsectiondelete')).first();
  }

  getFirstRenameMainsection() {
    return element.all(by.css('mainsection .mainsectionrename')).first();
  }

  getFirstMainsectionTitle() {
    return element(by.css('portal-mainwin accordion-group:first-child h4'));
  }

  getFirstMainsectionInput() {
    return element.all(by.css('mainsection:first-child form.mainsectionrename input.mainsectionrename'))
      .first();
  }
  getFirstMainsectionForm() {
    return element.all(by.css('mainsection:first-child form.mainsectionrename')).first();
  }

  getFirstMoveMainsection() {
    return element.all(by.css('mainsection .mainsectionmove')).first();
  }
  findMoveMainsectionOption() {
    return element.all(by.css('mainsection:first-child select')).first();
  }
  getFirstMainsectionMoveForm() {
    return element.all(by.css('mainsection:first-child form:nth-of-type(2)')).first();
  }


  getAddMainmenu() {
    return element(by.css('mainsection:first-child mainmenu-add > span > button'));
  }
  getMainmenuInput() {
    return element(by.css('mainsection:first-child mainmenu-add form input'));
  }
  getMainmenuForm() {
    return element(by.css('mainsection:first-child mainmenu-add form'));
  }
  getMainmenusCount() {
    return element.all(by.css('mainsection:first-child mainmenu')).count();
  }
  getMainmenusCountIs(v) {
    return element.all(by.css('mainsection:first-child mainmenu')).count().then(value => value == v);
  }
  getFirstMainmenuTitle() {
    return element.all(by.css('mainsection:first-child mainmenu:first-child span:first-child')).first();
  }

  getFirstMainmenuView() {
    return element.all(by.css('portal-mainwin button.mainmenuview'))
      .filter(e => e.isDisplayed())
      .first();
  }

  getFirstMainmenuRename() {
    return element.all(by.css('portal-mainwin button.mainmenurename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getFirstMainmenuInput() {
    return element.all(by.css('portal-mainwin input.mainmenurename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getFirstMainmenuForm() {
    return element.all(by.css('portal-mainwin form.mainmenurename'))
      .filter(e => e.isDisplayed())
      .first();
  }
  getFirstMainmenuMove() {
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
  getFirstMainmenuDelete() {
    return element.all(by.css('portal-mainwin button.mainmenudelete'))
      .filter(e => e.isDisplayed())
      .first();
  }
}
