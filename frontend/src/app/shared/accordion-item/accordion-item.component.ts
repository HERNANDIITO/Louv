/**
 * @file accordion-item.component.ts
 * @brief Componente de elemento de acordeón.
 *
 * @details
 * Representa un ítem de un acordeón que puede expandirse o colapsarse
 * mostrando u ocultando su contenido.
 */
import { Component, input, signal } from "@angular/core";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-accordion-item",
  imports: [FontAwesomeModule],
  templateUrl: "./accordion-item.component.html",
  styleUrl: "./accordion-item.component.scss",
})
export class AccordionItemComponent {
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  headerClass = input<string>();
  bodyClass = input<string>();
  containerClass = input<string>();
  subtitle = input<string>();
  
  title = input("");
  open = signal(false);

  /** Alterna el estado abierto/cerrado del acordeón */
  toggle() {
      this.open.update((o) => !o);
  }
}
