import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

import {FootertipService} from '../services/footertip/footertip';

@Component({
  selector: 'footertip',
  templateUrl: 'app///footertip/footertip.html',
  styleUrls: ['app///footertip/footertip.css'],
  providers: [],
  directives: [],
  pipes: []
})
export class Footertip implements OnInit, OnDestroy {
  tip: string;
  private subscription: Subscription;

  constructor(private footertipService: FootertipService) { }

  ngOnInit() {
    this.footertipService.tip$.subscribe(
      updatedTip => this.tip = updatedTip);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
