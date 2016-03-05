import {Input, Directive, ElementRef, Inject} from 'angular2/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    @Input() focus: boolean;

    constructor(@Inject(ElementRef) private element: ElementRef) {}
    protected ngOnChanges() {
        this.element.nativeElement.focus();
    }
}
