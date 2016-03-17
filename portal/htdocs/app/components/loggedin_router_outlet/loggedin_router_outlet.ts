import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';

import {LoginCmp} from '../../components/login/login';
import {UserService} from '../../services/user';

@Directive({selector: 'loggedin-router-outlet', providers: [UserService]})

export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;

  // We call the parent constructor
  constructor(
      _elementRef: ElementRef, _loader: DynamicComponentLoader, _parentRouter: Router,
      nameAttr: string, private _userService: UserService) {
    super(_elementRef, _loader, _parentRouter, nameAttr);
    this.parentRouter = _parentRouter;
    this.publicRoutes = {'/login': true, '/signup': true};
  }

  activate(instruction: ComponentInstruction) {
    var url = this.parentRouter.lastNavigationAttempt;
    if (!this.publicRoutes[url] && !this._userService.isConnected()) {
      // todo: redirect to Login, may be there a better way?
      this.parentRouter.navigateByUrl('/login');
    }
    return super.activate(instruction);
  }
}
