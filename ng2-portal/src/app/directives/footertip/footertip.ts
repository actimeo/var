import {Input, Directive, ElementRef,
    DynamicComponentLoader, HostListener, ComponentRef} from 'angular2/core';


@Directive({
    selector: '[footertip]'
})
export class Footertip {

    @Input('footertip') public content: string;

    private visible: boolean = false;
    private footertip: Promise<ComponentRef>;

    constructor(public element: ElementRef,
        public loader: DynamicComponentLoader) {
    }

    @HostListener('focusin', ['$event', '$target'])
    @HostListener('mouseenter', ['$event', '$target'])
    show() {
        if (this.visible) {
            return;
        }
        this.visible = true;

        // TODO
        console.log('show');
    }

    // params event, target
    @HostListener('focusout', ['$event', '$target'])
    @HostListener('mouseleave', ['$event', '$target'])
    hide() {
        if (!this.visible) {
            return;
        }
        this.visible = false;

        // TODO
        console.log('hide');
    }

}
