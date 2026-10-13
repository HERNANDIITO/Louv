import { Component, inject, effect, signal, computed } from '@angular/core';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';
import { BaseStructureVariant } from '../../../interfaces/baseStructure.interface';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gem-selection',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './gem-selection.component.html',
  styleUrl: './gem-selection.component.scss'
})
export class GemSelectionComponent {
  private editJewelService = inject(EditJewelService);

  // Vinculamos a los signals globales
  jewel = this.editJewelService.jewel;
  selectedGemIndex = this.editJewelService.selectedGemIndex;
  // Lista de settings que NO son de tipo embeded(incrustados)
  filteredEmbededSettings = this.editJewelService.filteredEmbededSettings;

  // Signal local para la variante (para saber cuántas gemas mostrar)
  variant = signal<BaseStructureVariant | undefined>(undefined);
  faCircleInfo = faCircleInfo;

  constructor() {
    /**
     * Cada vez que la joya cambie, actualizamos la variante.
     * Esto controla que si pasas de un anillo de 3 gemas a uno de 1,
     * el selector se ajuste automáticamente.
     */
    effect(async () => {
      // Trigger al cambiar la joya
      this.jewel(); 
      
      const v = this.editJewelService.getVariant();
      this.variant.set(v);

      // Validación: si la variante actual tiene menos gemas que el índice seleccionado, reseteamos a 0
      if (v && this.selectedGemIndex() >= v.settingsInfo.length) {
        this.editJewelService.editSelectedGem(0);
      }
    });
  }

  onSelectedChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const index = Number(selectElement.value);
    this.editJewelService.editSelectedGem(index);
  }
}