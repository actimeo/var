import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TopbarService {

  private titleSource = new Subject<string>();
  private subtitleSource = new Subject<string>();
  private menuOpenSource = new Subject<boolean>();

  title$ = this.titleSource.asObservable();
  subtitle$ = this.subtitleSource.asObservable();
  menuOpen$ = this.menuOpenSource.asObservable();

  setTitle(title: string) {
    this.titleSource.next(title);
  }

  setSubtitle(subtitle: string) {
    this.subtitleSource.next(subtitle);
  }

  setMenuOpen(menuOpen: boolean) {
    this.menuOpenSource.next(menuOpen);
  }
}
