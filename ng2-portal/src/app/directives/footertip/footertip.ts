import {
  Input,
  Directive,
  ElementRef,
  DynamicComponentLoader,
  HostListener,
  AfterViewInit
} from 'angular2/core';

import {I18nService} from 'ng2-i18next/ng2-i18next';

import {FootertipService} from '../../services/footertip/footertip';

@Directive({
  selector: '[footertip]'
})
export class Footertip implements AfterViewInit {
  @Input('footertip') public content: string;

  private visible: boolean = false;
  private translated: string;

  constructor(
    public element: ElementRef, public loader: DynamicComponentLoader,
    private footertipService: FootertipService,
    private i18n: I18nService) { }

  ngAfterViewInit() {
    this.translated = this.i18n.t(this.content);
  }

  @HostListener('focusin', ['$event', '$target'])
  @HostListener('mouseenter', ['$event', '$target'])
  show() {
    if (this.visible) {
      return;
    }
    this.visible = true;

    this.footertipService.setTip(this.translated);
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
