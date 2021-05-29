import {
    Directive,
    HostListener,
    ElementRef
  } from "@angular/core";
  import { FormGroupDirective } from "@angular/forms";
  import { fromEvent } from "rxjs";
  import { debounceTime, take } from "rxjs/operators";
  
  @Directive({
    selector: "[appInvalidControlScroll]"
  })
  /**
   * Directive class to scroll to first invalid control
   */
  export class InvalidControlScrollDirective {
   
    constructor(
      private el: ElementRef,
      private formGroupDir: FormGroupDirective
    ) {}
  
    @HostListener("ngSubmit") onSubmit() {
      if (this.formGroupDir.control.invalid) {
        this.scrollToFirstInvalidControl();
        
      }
    }
  
    private scrollToFirstInvalidControl() {
      const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        ".ng-invalid"
      );
  
      window.scroll({
        top: this.getTopOffset(firstInvalidControl),
        left: 0,
        behavior: "smooth"
      });
  
      fromEvent(window, "scroll")
        .pipe(
          debounceTime(100),
          take(1)
        )
        .subscribe(() => firstInvalidControl.focus());
    }
  
    private getTopOffset(controlEl: HTMLElement): number {
      const labelOffset = 50;
      return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }
  }