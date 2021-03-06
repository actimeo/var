import {PipeTransform, Pipe} from 'angular2/core';

import {I18nService} from 'ng2-i18next/ng2-i18next';

@Pipe({
  name: 'pmemove',

})
export class PmeMovePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(value, section) {
    if (value == null) {
      return null;
    }
    let addEnd = (value[value.length - 1].pme_id !== section.pme_id);
    let endPos = value.length + 1;
    let ret =
        value
            .filter(
                elt => (section.pme_id !== elt.pme_id && section.pme_order !== elt.pme_order - 1))
            .map(elt => {
              elt.pme_name = this.i18n.t('portal.move.before_something', {what: elt.pme_name});
              return elt;
            });
    if (addEnd) {
      ret.push({pme_name: this.i18n.t('portal.move.at_the_end'), pme_order: endPos});
    }
    return ret;
  }
}
