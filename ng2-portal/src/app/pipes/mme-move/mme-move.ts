import {PipeTransform, Pipe} from 'angular2/core';

import {I18nService} from 'ng2-i18next/ng2-i18next';

@Pipe({
  name: 'mmemove',

})
export class MmeMovePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(value, section) {
    if (value == null) {
      return null;
    }
    let addEnd = (value[value.length - 1].mme_id !== section.mme_id);
    let endPos = value.length + 1;
    let ret =
        value
            .filter(
                elt => (section.mme_id !== elt.mme_id && section.mme_order !== elt.mme_order - 1))
            .map(elt => {
              elt.mme_name = this.i18n.t('portal.move.before_something', {what: elt.mme_name});
              return elt;
            });
    if (addEnd) {
      ret.push({mme_name: this.i18n.t('portal.move.at_the_end'), mme_order: endPos});
    }
    return ret;
  }
}
