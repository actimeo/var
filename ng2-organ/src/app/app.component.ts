import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { HomeComponent } from './home';
import { HomeSystemComponent } from './home-system';
import { HomeOrganizationsComponent } from './home-organizations';
import { HomePortalsComponent } from './home-portals';
import { DataProviderService } from './data-provider.service';

import 'primeuiNgAll';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [DataProviderService],
  precompile: [HomeComponent, HomePortalsComponent, HomeOrganizationsComponent, HomeSystemComponent]
})
export class AppComponent {
  title = 'app works!';

}
