import {Injectable} from 'angular2/core';

declare var i18next: any;
declare var i18nextBrowserLanguageDetector: any;
declare var i18nextXHRBackend: any;

@Injectable()
export class I18nService {
  i18n: any;

  constructor() {
    this.i18n = i18next;
    this.i18n
      .use(i18nextXHRBackend)
      .use(i18nextBrowserLanguageDetector)
      .init(
      {
        detection: { order: ['navigator'] },
        fallbackLng: 'en'
      },
      (err, t) => { });
  }

  t(s: string, opts: any = undefined) { return this.i18n.t(s, opts); }
}
