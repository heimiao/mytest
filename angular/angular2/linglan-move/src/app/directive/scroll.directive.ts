import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.border = '1px solid red';
  }

  color: string;
  @HostListener('scroll') onScrollEvent() {
    console.log(document.querySelector("body").offsetHeight);
    console.log(this.el.nativeElement.style.outerHeight);
  }




}

