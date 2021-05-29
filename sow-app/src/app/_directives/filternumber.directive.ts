import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appfilternumber]'
})
export class FilternumberDirective {

  constructor(private el: ElementRef) {
  }
  
  /**
    * Prevent using from entering 'e'
    */ 
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): boolean {
    if (event.key == 'e' || event.key == 'E'
        || event.key == '-' || event.key == '+')  {
      return false;
    }
  }

  // 
  /**
   * Handle copy paste, prevent 'E' characters from being pasted in
   * @param event - The event triggered
   */
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    // Get pasted data via clipboard API
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text').toUpperCase();

    // Stop the copy paste when 'E', '-' or '+' is found
    if (pastedText.indexOf('E') > -1 ||
        pastedText.indexOf('-') > -1 ||
        pastedText.indexOf('+') > -1) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
