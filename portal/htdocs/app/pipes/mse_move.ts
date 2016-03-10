import {I18nService} from "../services/i18n";
import {PipeTransform, Pipe} from "angular2/core";

@Pipe({
    name: "msemove",

})
export class MseMovePipe implements PipeTransform {
    constructor(private i18n: I18nService) { }

    transform(value, arg) {
        if (value == null)
            return null;
        let section = arg.pop();
        let addEnd = (value[value.length - 1].mse_id !== section.mse_id);
        let endPos = value.length + 1;
        let ret = value
            .filter(elt => (section.mse_id !== elt.mse_id
                && section.mse_order !== elt.mse_order - 1))
            .map(elt => { elt.mse_name = this.i18n.t("portal.move.before_something", { what: elt.mse_name }); return elt; });
        if (addEnd)
            ret.push({ mse_name: this.i18n.t("portal.move.at_the_end"), mse_order: endPos });
        return ret;
    }
}
