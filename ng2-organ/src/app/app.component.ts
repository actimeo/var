import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { LoginComponent } from './login';
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
  precompile: [LoginComponent, HomeComponent, HomePortalsComponent, HomeOrganizationsComponent, HomeSystemComponent]
})
export class AppComponent { }
