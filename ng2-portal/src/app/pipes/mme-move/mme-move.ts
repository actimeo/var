import {I18nService} from '../../services/i18n/i18n';
import {PipeTransform, Pipe} from 'angular2/core';

@Pipe({
    name: 'mmemove',

})
export class MmeMovePipe implements PipeTransform {
    constructor(private i18n: I18nService) { }

    transform(value, arg) {
        if (value == null) {
            return null;
        }
        let section = arg.pop();
        let addEnd = (value[value.length - 1].mme_id !== section.mme_id);
        let endPos = value.length + 1;
        let ret =
            value
                .filter(
                elt => (section.mme_id !== elt.mme_id && section.mme_order !== elt.mme_order - 1))
                .map(elt => {
                    elt.mme_name = this.i18n.t('portal.move.before_something', {
                        what: elt.mme_name
                    });
                    return elt;
                });
        if (addEnd) {
            ret.push({ mme_name: this.i18n.t('portal.move.at_the_end'), mme_order: endPos });
        }
        return ret;
    }
}
