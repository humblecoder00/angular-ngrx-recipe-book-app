import { Directive, HostListener, HostBinding } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})

export class DropdownDirective {
    // class prop in an element is simply an array. 
    // here we reach to it, rest will be handled by Angular.
    // because since this is false initially, it will only get attached when we simply toggle it
    @HostBinding('class.open') isOpen = false

    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen
    }
}