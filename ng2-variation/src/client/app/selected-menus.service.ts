import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

export class SelectedMenuType {
  mainmenu: number;
  personmenu: {
    [key: string]: number;
    [id: number]: number;
  };
}

@Injectable()
export class SelectedMenusService {
  menu$: Observable<SelectedMenuType>;
  private menuObserver: Observer<SelectedMenuType>;
  private menuStore: SelectedMenuType;

  constructor() {
    this.menuStore = { mainmenu: null, personmenu: {} };
    this.menu$ = new Observable(observer => this.menuObserver = observer)
      .startWith(this.menuStore)
      .share();
  }

  setMainmenu(m: number) {
    this.menuStore.mainmenu = m;
    this.menuObserver.next(this.menuStore);
  }

  setPersonmenu(entity: string, m: number) {
/*    this.menuStore.personmenu[entity] = m;
    this.menuObserver.next(this.menuStore);*/
  }

  getMainmenu() { return this.menuStore.mainmenu; }

  getPersonmenu(entity: string) { /*return this.menuStore.personmenu[entity];*/ }
}
