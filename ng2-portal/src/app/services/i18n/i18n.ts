import {Injectable} from 'angular2/core';

declare var i18next: any;
declare var i18nextBrowserLanguageDetector: any;
declare var fr_translations: any;
declare var de_translations: any;
declare var en_translations: any;

@Injectable()
export class I18nService {
  i18n: any;

  constructor() {
    this.i18n = i18next;
    this.i18n.use(i18nextBrowserLanguageDetector)
        .init(
            {
              detection: {order: ['navigator']},

              resources: {
                en: {translation: en_translations},
                de: {translation: de_translations},
                fr: {translation: fr_translations}
              }
            },
            (err, t) => {});
  }

  t(s: string, opts: any = undefined) { return this.i18n.t(s, opts); }
}
