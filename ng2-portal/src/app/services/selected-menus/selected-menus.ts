import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()
export class SelectedMenus {

  menu$: Observable<any>;
  private menuObserver: Observer<any>;
  private menuStore: { mainmenu: number, personmenu: any };

  constructor() {
    this.menu$ = new Observable(observer => this.menuObserver = observer).share();
    this.menuStore = { mainmenu: null, personmenu: {} };
  }

  setMainmenu(m: number) {
    this.menuStore.mainmenu = m;
    this.menuObserver.next(this.menuStore);
  }

  setPersonmenu(entity: string, m: number) {
    this.menuStore.personmenu[entity] = m;
    this.menuObserver.next(this.menuStore);
  }

  getMainmenu() {
    return this.menuStore.mainmenu;
  }
}
