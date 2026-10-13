import { Component, inject, effect, signal, input, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { Material } from '../../../interfaces/material.interface';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';

@Component({
  selector: 'app-material-section',
  standalone: true,
  imports: [ItemComponent],
  templateUrl: './material-section.component.html',
  styleUrl: './material-section.component.scss'
})
export class MaterialSectionComponent {
  private editJewelService = inject(EditJewelService);

  // Lista de todos los materiales disponibles (vienen del EditorComponent)
  section = input.required<Material[]>();

  @ViewChildren('item', { read: ElementRef }) items!: QueryList<ElementRef>
  @ViewChild('subsection') subsection!: ElementRef<HTMLElement>;

  // Vinculamos al signal global
  jewel = this.editJewelService.jewel;

  // Signal local para el objeto material seleccionado (contiene las purezas)
  selectedMaterial = signal<Material | undefined>(undefined);

  cols: number = 3;
  selectedCol = signal<number>(0);
  subsectionOpen: boolean = true;

  constructor() {
    /**
     * Cada vez que la joya cambie (especialmente el materialID),
     * pedimos al servicio el objeto Material completo para mostrar sus purezas.
     */
    effect(async () => {
      // Trigger cuando cambie la joya
      this.jewel(); 
      
      const material = await this.editJewelService.getMaterial();
      this.selectedMaterial.set(material);
    });

    effect(() => {
      const selectedMaterial = this.selectedMaterial();

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

    if (!itemArray[rowEndIndex]) return;
    if ( !this.subsection ) return;

    itemArray[rowEndIndex].nativeElement.after(this.subsection.nativeElement);
  }

  onItemClick(type: string, itemID: string) {
    switch (type) {
      case "material":
        if (this.selectedMaterial()?._id === itemID) {
          this.subsectionOpen = !this.subsectionOpen;
          this.moveDetailsBelowSelectedRow()
          return;
        } else {
          this.subsectionOpen = true;
        }

        this.editJewelService.editMaterial(itemID);
        break;
        
      case "purity":
        this.editJewelService.editPurity(itemID);
        break;
    }
  }
}