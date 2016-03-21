import {
  Input,
  Directive,
  ElementRef,
  DynamicComponentLoader,
  HostListener,
  ComponentRef
} from 'angular2/core';

import {FootertipService} from '../../services/footertip/footertip';

@Directive({selector: '[footertip]'})
export class Footertip {
  @Input('footertip') public content: string;

  private visible: boolean = false;

  constructor(
      public element: ElementRef, public loader: DynamicComponentLoader,
      private footertipService: FootertipService) {}

  @HostListener('focusin', ['$event', '$target']) @HostListener('mouseenter', ['$event', '$target'])
  show() {
    if (this.visible) {
      return;
    }
    this.visible = true;

    this.footertipService.setTip(this.content);
  }

  // params event, target
  @HostListener('focusout', ['$event', '$target'])
  @HostListener('mouseleave', ['$event', '$target'])
  hide() {
    if (!this.visible) {
      return;
    }
    this.visible = false;

    this.footertipService.clearTip();
  }
}
