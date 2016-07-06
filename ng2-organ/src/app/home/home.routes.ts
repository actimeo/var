import { RouterConfig } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeSystemComponent } from '../home-system';
import { HomeOrganizationsComponent } from '../home-organizations';
import { HomePortalsComponent } from '../home-portals';
import { AuthGuard } from '../shared/auth.guard';

export const HomeRoutes: RouterConfig = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'system', component: HomeSystemComponent },
      { path: 'organization', component: HomeOrganizationsComponent },
      { path: 'portals', component: HomePortalsComponent },
    ]
  }
];
