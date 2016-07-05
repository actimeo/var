import { provideRouter, RouterConfig } from '@angular/router';

import { LoginComponent } from './login';
import { HomeComponent } from './home';
import { AuthGuard } from './shared/auth.guard';

import { HomeRoutes } from './home/home.routes';

export const routes: RouterConfig = [
  { path: '', component: LoginComponent  },
  { path: 'login', component: LoginComponent  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  ...HomeRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
