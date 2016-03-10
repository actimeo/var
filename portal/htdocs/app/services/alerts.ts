import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/share";

@Injectable()
export class AlertsService {
    alerts$: Observable<Array<any>>;
    private _alertsObserver: any;
    private _alertStore: {
        alerts: Array<any>
    };

    constructor() {
        this.alerts$ = new Observable(observer =>
            this._alertsObserver = observer).share();
        this._alertStore = { alerts: [] };
        console.log("AlertsService cons");
    }

    success(msg: string) {
        this.addAlert("success", msg);
    }

    info(msg: string) {
        this.addAlert("info", msg);
    }

    warning(msg: string) {
        this.addAlert("warning", msg);
    }

    danger(msg: string) {
        this.addAlert("danger", msg);
    }

    closeAlert(i: number) {
        this._alertStore.alerts.splice(i, 1);
        this._alertsObserver.next(this._alertStore.alerts);
        console.log("AlertsService closeAlert");
    }


    addAlert(type: string, msg: string) {
        this._alertStore.alerts.push({ msg: msg, type: type, closable: true });
        this._alertsObserver.next(this._alertStore.alerts);
        console.log("AlertsService addAlert");
    }

}
