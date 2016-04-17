import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

@Injectable()
export class FootertipService {
  tip$: Observable<string>;
  private tipObserver: Observer<string>;
  private tip: string;

  constructor() {
    this.tip = '';
    this.tip$ = new Observable(observer => this.tipObserver = observer)
      .startWith(this.tip)
      .share();
  }

  setTip(s: string) {
    this.tip = s;
    this.tipObserver.next(this.tip);
  }

  clearTip() { this.setTip(''); }
}
