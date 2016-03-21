import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

@Injectable()
export class AlertsService {
  alerts$: Observable<Array<any>>;
  private alertsObserver: any;
  private alertStore: {alerts: Array<any>};

  constructor() {
    this.alerts$ = new Observable(observer => {
        console.log('alertObserver set');
        this.alertsObserver = observer;
        }).share();
    this.alertStore = {alerts: []};
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
    this.alertStore.alerts.push({msg: msg, type: type, closable: true});
    this.alertsObserver.next(this.alertStore.alerts);
  }
}
