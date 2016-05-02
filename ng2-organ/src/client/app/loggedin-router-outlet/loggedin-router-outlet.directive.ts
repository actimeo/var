import {Directive, ViewContainerRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';

import {UserService} from 'ng2-postgresql-procedures/ng2-postgresql-procedures';

@Directive({selector: 'loggedin-router-outlet', providers: []})
export class LoggedinRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;

  // We call the parent constructor
  constructor(
      viewContainerRef: ViewContainerRef, loader: DynamicComponentLoader, parentRouter: Router,
      nameAttr: string, private userService: UserService) {
    super(viewContainerRef, loader, parentRouter, nameAttr);
    this.parentRouter = parentRouter;
    this.publicRoutes = {'/login': true, '/signup': true};
  }

  activate(instruction: ComponentInstruction) {
    var url = this.parentRouter.lastNavigationAttempt;
    if (!this.publicRoutes[url] && !this.userService.isConnected()) {
      // todo: redirect to Login, may be there a better way?
      this.parentRouter.navigateByUrl('/login');
    }
    return super.activate(instruction);
  }
}