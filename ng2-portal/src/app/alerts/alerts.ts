import {Component, OnInit, OnDestroy} from 'angular2/core';

import {Subscription} from 'rxjs/Subscription';

import {Alert} from 'ng2-bootstrap/ng2-bootstrap';
import {AlertsService, AlertType} from '../services/alerts/alerts';

@Component({
  selector: 'alerts',
  styleUrls: [],
  templateUrl: 'app/alerts/alerts.html',
  providers: [],
  directives: [Alert]
})
export class Alerts implements OnInit, OnDestroy {
  private alerts: AlertType[];
  private subscription: Subscription;

  constructor(private alertsService: AlertsService) { }

  ngOnInit() {
    this.subscription = this.alertsService.alerts$.subscribe(
      updatedAlerts => this.alerts = updatedAlerts);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  closeAlert(i: number) { this.alertsService.closeAlert(i); }
}
