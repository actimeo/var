import {Component} from 'angular2/core';

import {Alert} from 'ng2-bootstrap/ng2-bootstrap';
import {AlertsService} from '../../services/alerts';

@Component({
  selector : 'alerts',
  styles : [ `
	     ` ],
  template : `
	<alert *ngFor="#alert of alerts;#i = index" [type]="alert.type" dismissible="true" dismissOnTimeout="3000" (close)="closeAlert(i)">
  {{ alert?.msg }}
</alert>
    `,
  providers : [],
  directives : [ Alert ]
})
export class Alerts {
  private alerts: any;

  constructor(private alertsService: AlertsService) {
    alertsService.alerts$.subscribe(updatedAlerts => this.alerts =
                                        updatedAlerts);
  }

  closeAlert(i: number) { this.alertsService.closeAlert(i); }

  addAlert(type: string, msg: string) {
    this.alertsService.addAlert(type, msg);
  }
}
