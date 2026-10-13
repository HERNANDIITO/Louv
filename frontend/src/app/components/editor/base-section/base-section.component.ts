import { Component, inject, effect, signal, input, ViewChild, ElementRef, QueryList, ViewChildren, OnInit, AfterViewInit } from "@angular/core";
import { ItemComponent } from "../item/item.component";
import {
  BaseStructure,
  BaseStructureProfile,
  BaseStructureVariant,
} from "../../../interfaces/baseStructure.interface";
import { EditJewelService } from "../../../services/editorServices/editJewel.service";
import { SizeSectionComponent } from "./size-section/size-section.component";

@Component({
  selector: "app-base-section",
  standalone: true,
  imports: [ItemComponent, SizeSectionComponent],
  templateUrl: "./base-section.component.html",
  styleUrl: "./base-section.component.scss",
})
export class BaseSectionComponent {
  private editJewelService = inject(EditJewelService);

  @ViewChild('subsection') subsection!: ElementRef<HTMLElement>;
  @ViewChildren('item', { read: ElementRef }) items!: QueryList<ElementRef>

  // Input que viene del EditorComponent (la lista de todas las bases disponibles)
  section = input.required<BaseStructure[]>();

  selectedItem: number = 1;

  cols: number = 3;
  selectedCol = signal<number>(0);
  subsectionOpen: boolean = true;

  // Vinculamos el signal de la joya directamente
  jewel = this.editJewelService.jewel;

  // Signals locales para guardar los objetos completos y pintar los perfiles/variantes
  selectedBase = signal<BaseStructure | undefined>(undefined);
  selectedProfile = signal<BaseStructureProfile | undefined>(undefined);
  selectedVariant = signal<BaseStructureVariant | undefined>(undefined);

  constructor() {
    /**
     * Este efecto se dispara cada vez que la joya cambia.
     * Se encarga de pedir a la API los objetos completos para que el HTML
     * tenga las listas de perfiles y variantes actualizadas.
     */
    effect(async () => {
      // Accedemos al signal (trigger)
      const currentJewel = this.jewel();

      // Obtenemos los datos completos a través de los getters del servicio
      const base = await this.editJewelService.getBaseStructure();
      const profile = await this.editJewelService.getProfile();
      const variant = await this.editJewelService.getVariant();

      // Actualizamos los signals locales de UI
      this.selectedBase.set(base);
      this.selectedProfile.set(profile);
      this.selectedVariant.set(variant);

    });

    effect(() => {
      const selectedBase = this.selectedBase();
      const selectedProfile = this.selectedProfile();
      const selectedVariant = this.selectedVariant();

      if ( this.items && this.items.toArray().length != 0 ) {
        this.moveDetailsBelowSelectedRow();
      }
    });

  }

  moveDetailsBelowSelectedRow() {
    const itemArray = this.items.toArray();

    const rowEndIndex = Math.min(
      Math.floor(this.selectedCol() / this.cols) * this.cols + (this.cols - 1),
      itemArray.length - 1,
    );

    if ( !itemArray[rowEndIndex] ) return;
    if ( !this.subsection ) return;
    
    itemArray[rowEndIndex].nativeElement.after(this.subsection.nativeElement);
  }

  onItemClick(type: string, itemID: string) {
    switch (type) {
      case "base":

        if (this.selectedBase()?._id === itemID) {
          this.subsectionOpen = !this.subsectionOpen;
          return;
        } else {
          this.subsectionOpen = true;
        }

        this.editJewelService.editBaseStructure(itemID);
        break;
      case "profile":
        this.editJewelService.editProfile(itemID);
        break;
      case "variant":
        // Buscamos la variante para saber cuántos settings tiene
        const variantObj = this.selectedProfile()?.variants.find(
          (v) => v._id === itemID,
        );
        if (variantObj) {
          this.editJewelService.editVariant(itemID);
        }
        break;
    }
  }
}
