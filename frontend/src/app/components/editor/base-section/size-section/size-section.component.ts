import { Component, effect, inject, signal } from '@angular/core';
import { SizesService } from '../../../../services/ringParts/size.service';
import { Size } from '../../../../interfaces/size.interface';
import { MEASUREMENT_SYSTEMS } from '../../../../interfaces/enums';
import { EditJewelService } from '../../../../services/editorServices/editJewel.service';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

type SizeGroup = {
  system: MEASUREMENT_SYSTEMS,
  sizes: Size[]
}

@Component({
  selector: 'app-size-section',
  imports: [FaIconComponent],
  templateUrl: './size-section.component.html',
  styleUrl: './size-section.component.scss'
})
export class SizeSectionComponent {
  sizeService = inject(SizesService)
  jewelService = inject(EditJewelService);
  
  sizes = signal<Size[]>([]);
  selectedSize = signal<string>("");

  icons = {
    faChevronDown
  }

  jewel = this.jewelService.jewel;

  mesureSys = MEASUREMENT_SYSTEMS;

  constructor() {
    this.sizeService.getSizes().subscribe({
      next: (res: any) => {
        const groupSizes = this.groupSizesBySystem(res.sizes);
        this.sizes.set(res.sizes);
      }
    })

    effect(async () => {
      // Accedemos al signal (trigger)
      const currentJewel = this.jewel();

      // Obtenemos los datos completos a través de los getters del servicio
      const size = this.jewelService.getSize();

      // Actualizamos los signals locales de UI
      this.selectedSize.set(size)

    });
  }

  selectSize(event: Event) {
    const sizeID = (event.target as HTMLSelectElement).value;
    this.jewelService.editSize(sizeID);
  } 

  groupSizesBySystem (sizes: Size[]): SizeGroup[] {
    const grouped = sizes.reduce<Record<string, SizeGroup>>((acc, size) => {
      const { system } = size;

      if (!acc[system]) {
        acc[system] = {
          system,
          sizes: [],
        };
      }

      acc[system].sizes.push(size);

      return acc;
    }, {});

    return Object.values(grouped);
  };

}

