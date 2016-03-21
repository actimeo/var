import {Directive, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';

import {UserService} from '../services/user/user';

@Directive({selector: 'loggedin-router-outlet', providers: []})
export class LoggedinRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;

  // We call the parent constructor
  constructor(
      elementRef: ElementRef, loader: DynamicComponentLoader, parentRouter: Router,
      nameAttr: string, private userService: UserService) {
    super(elementRef, loader, parentRouter, nameAttr);
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