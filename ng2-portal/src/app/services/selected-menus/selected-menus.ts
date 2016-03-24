import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()
export class SelectedMenus {

  menu$: Observable<number>;
  private menuObserver: Observer<number>;
  private menuStore: { menu: number };

  constructor() {
    this.menu$ = new Observable(observer => this.menuObserver = observer).share();
    this.menuStore = { menu: null };
  }

  setMenu(m: number) {
    this.menuStore.menu = m;
    this.menuObserver.next(this.menuStore.menu);
  }
}
