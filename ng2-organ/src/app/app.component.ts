import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { DataProviderService } from './data-provider.service';

import 'primeuiNgAll';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [DataProviderService]
})
export class AppComponent {
  title = 'app works!';

}
