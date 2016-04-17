import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

export class AlertType {
  msg: string;
  type: string;
  closable: boolean;
}

@Injectable()
export class AlertsService {
  alerts$: Observable<AlertType[]>;
  private alertsObserver: Observer<AlertType[]>;
  private alertStore: { alerts: AlertType[] };

  constructor() {
    this.alertStore = { alerts: [] };
    this.alerts$ = new Observable(observer => { this.alertsObserver = observer; })
      .startWith(this.alertStore.alerts)
      .share();
  }

  success(msg: string) { this.addAlert('success', msg); }

  info(msg: string) { this.addAlert('info', msg); }

  warning(msg: string) { this.addAlert('warning', msg); }

  danger(msg: string) { this.addAlert('danger', msg); }

  closeAlert(i: number) {
    this.alertStore.alerts.splice(i, 1);
    this.alertsObserver.next(this.alertStore.alerts);
  }

  addAlert(type: string, msg: string) {
    this.alertStore.alerts.push({ msg: msg, type: type, closable: true });
    this.alertsObserver.next(this.alertStore.alerts);
  }
}
