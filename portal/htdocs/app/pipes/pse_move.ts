import {I18nService} from '../services/i18n';
import {PipeTransform, Pipe} from 'angular2/core';

@Pipe({
  name: 'psemove',

})
export class PseMovePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(value, arg) {
    if (value == null) {
      return null;
    }
    let section = arg.pop();
    let addEnd = (value[value.length - 1].pse_id !== section.pse_id);
    let endPos = value.length + 1;
    let ret =
        value
            .filter(
                elt => (section.pse_id !== elt.pse_id && section.pse_order !== elt.pse_order - 1))
            .map(elt => {
              elt.pse_name = this.i18n.t('portal.move.before_something', {what: elt.pse_name});
              return elt;
            });
    if (addEnd) {
      ret.push({pse_name: this.i18n.t('portal.move.at_the_end'), pse_order: endPos});
    }
    return ret;
  }
}
