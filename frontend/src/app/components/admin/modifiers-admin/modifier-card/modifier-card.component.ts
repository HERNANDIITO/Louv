import { Component, input, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { JsonExplorerComponent } from './json-explorer/json-explorer.component';

@Component({
  selector: 'app-modifier-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, JsonExplorerComponent],
  templateUrl: './modifier-card.component.html',
  styleUrls: ['./modifier-card.component.scss']
})
export class ModifierCardComponent {

  faChevronLeft = faChevronLeft;
  modifier = input<any>();
  showDetails = signal(false);

  toggleDetails() {
    this.showDetails.update(v => !v);
  }

  getImageName(): string {
    // Si modifier.image es 'assets/images/miImagen.jpg', devuelve 'miImagen.jpg'
    if (!this.modifier()?.image) return 'NA';
    const parts = this.modifier().image.split('/');
    return parts[parts.length - 1]; // devuelve solo el nombre
  }

  getModel() {
    return this.modifier()?.model || 'NA';
  }

  /**
   * Devuelve detalles especiales según el tipo de JSON:
   *  - gemstone → purities, zodiac…
   *  - material → purities, recommendedGems…
   *  - cut → faces…
   *  - box → sizes…
   */
  getDetailsList(): { label: string; value: any }[] {
    const m = this.modifier();

    const details: any[] = [];

    if (!m) return details;

    if (m.purities) {
      details.push({ label: 'Purezas', value: m.purities.map((p: any) => p.class).join(', ') });
    }

    if (m.recommendedGems) {
      details.push({ label: 'Gemas recomendadas', value: m.recommendedGems.length });
    }

    if (m.zodiac) {
      details.push({ label: 'Signos zodiacales', value: m.zodiac.join(', ') });
    }

    if (m.faces) {
      details.push({ label: 'Caras del corte', value: m.faces });
    }

    if (m.sizes) {
      details.push({ label: 'Tamaños', value: m.sizes.join(', ') });
    }

    return details;
  }


}
