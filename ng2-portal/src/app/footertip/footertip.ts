import {Component} from 'angular2/core';

import {FootertipService} from '../services/footertip/footertip';

@Component({
  selector: 'footertip',
  templateUrl: 'app///footertip/footertip.html',
  styleUrls: ['app///footertip/footertip.css'],
  providers: [],
  directives: [],
  pipes: []
})
export class Footertip {
  tip: string;

  constructor(private footertipService: FootertipService) {
  }

  ngOnInit() {
    this.footertipService.tip$.subscribe(updatedTip => { this.tip = updatedTip; });
  }
}
