import { Component, ElementRef } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-go-up-button',
  imports: [FaIconComponent],
  templateUrl: './go-up-button.component.html',
  styleUrl: './go-up-button.component.scss'
})
export class GoUpButtonComponent {
  constructor(private host: ElementRef<HTMLElement>) {}

  faUpArrow = faArrowUp;

  scrollToTop(): void {
    const scrollParent = this.host.nativeElement.parentElement;

    scrollParent?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
