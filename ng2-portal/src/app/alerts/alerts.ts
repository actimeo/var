import {Component} from 'angular2/core';

import {Alert} from 'ng2-bootstrap/ng2-bootstrap';
import {AlertsService} from '../services/alerts/alerts';

@Component({
  selector: 'alerts',
  styleUrls: [],
  templateUrl: 'app/alerts/alerts.html',
  providers: [],
  directives: [Alert]
})
export class Alerts {
  private alerts: any;

  constructor(private alertsService: AlertsService) {
    alertsService.alerts$.subscribe(updatedAlerts => this.alerts = updatedAlerts);
  }

  closeAlert(i: number) { this.alertsService.closeAlert(i); }

  addAlert(type: string, msg: string) { this.alertsService.addAlert(type, msg); }
}
