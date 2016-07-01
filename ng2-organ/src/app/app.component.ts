import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import 'primeuiNgAll';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ ROUTER_DIRECTIVES ]
})
export class AppComponent {
  title = 'app works!';
}
