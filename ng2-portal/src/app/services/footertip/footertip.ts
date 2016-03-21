import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()
export class FootertipService {

    tip$: Observable<string>;
    private tipObserver: Observer<string>;
    private tipStore: { tip: string };

    constructor() {
        this.tip$ = new Observable(observer => this.tipObserver = observer).share();
        this.tipStore = { tip: '' };
    }

    setTip(s: string) {
        this.tipStore.tip = s;
        this.tipObserver.next(this.tipStore.tip);
    }

    clearTip() {
        this.setTip('');
    }
}
