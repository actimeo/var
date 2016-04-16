import {Directive, Input, Renderer, ElementRef, AfterContentInit} from 'angular2/core';

import {I18nService} from '../../services/i18n/i18n';

@Directive({
  selector: '[i18n],[i18n-placeholder]',
  providers: [],
  host: {}
})
export class I18nDirective implements AfterContentInit {
  @Input('i18n') content: string;
  @Input('i18n-placeholder') phContent: string;

  constructor(private i18n: I18nService, private el: ElementRef, private renderer: Renderer) {
  }

  /* 
     If the i18next module is initialized, the promise is resolved with the text to display.

     If the i18next module is not yet initialized, the promise is rejected: we subscribe
     to the i18nextService observable which will alert us when the module is initialized 
  */
  ngAfterContentInit() {
    this.loadAndRender(this.content, (s) => {
      this.renderer.setText(this.el.nativeElement, s);
    });

    this.loadAndRender(this.phContent, (s) => {
      this.renderer.setElementAttribute(this.el.nativeElement, 'placeholder', s);
    });
  }

  loadAndRender(code: string, doRenderCallback) {
    if (!code) {
      return;
    }

    this.i18n.tPromise(code)

      .then((val: string) => {
        doRenderCallback(val);
      })

      .catch((val: string) => {
        doRenderCallback(' ');
        var obs = this.i18n.alerts$.subscribe(b => {
          doRenderCallback(this.i18n.t(code));
          obs.unsubscribe();
        });
      });
  }
}
