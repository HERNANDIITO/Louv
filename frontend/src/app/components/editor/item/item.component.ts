import { Component, input, output } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  faWarning = faExclamationTriangle;

  item = input.required<any>();

  img = input<string>();
  isCompatible = input<boolean>(true);
  isCompatibleGem = input<boolean>(true);
  isMain = input<boolean>(false);
  material = input<string>();
  open = input<boolean>(false);
  selected = input<boolean>(false);
  beenSelected = output<string>();

  select() {
    this.beenSelected.emit(this.item()._id);
  }

  getDefault(event: Event) {
    if (this.material()) return;
    const img = event.target as HTMLImageElement;
    img.src = '/images/landing_banner_ring.webp';
  }
}