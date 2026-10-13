import { Component, effect, ElementRef, inject, input, OnInit, output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { ItemComponent } from "../item/item.component";
import { Box, BoxDetailMaterial, BoxInnerMaterial, BoxOuterMaterial } from '../../../interfaces/box.interface';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';
import { BoxService } from '../../../services/ringParts/box.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-box-section',
  imports: [ItemComponent],
  templateUrl: './box-section.component.html',
  styleUrl: './box-section.component.scss'
})
export class BoxSectionComponent {
  private editJewelService = inject(EditJewelService);
  private boxService = inject(BoxService);

  @ViewChild('subsection') subsection!: ElementRef<HTMLElement>;
  @ViewChildren('item', { read: ElementRef }) items!: QueryList<ElementRef>

  boxShapes = input<Box[]>();
  selectItemID = output<any>();

  outerColors: BoxOuterMaterial[]  = [];
  innerColors: BoxInnerMaterial[]  = [];
  details:     BoxDetailMaterial[] = [];

  jewel = this.editJewelService.jewel;

  selectedBox = signal<string | undefined>(undefined);
  selectedInnerColor  = signal<BoxOuterMaterial  | undefined>(undefined);
  selectedOuterColor  = signal<BoxInnerMaterial  | undefined>(undefined);
  selectedDetailColor = signal<BoxDetailMaterial | undefined>(undefined);

  cols: number = 3;
  selectedCol: number = 0;
  subsectionOpen: boolean = false;

  constructor() {
    effect(async () => {
      const currentJewel = this.jewel();
      const box = this.editJewelService.getBox();
      if (box === undefined || !box.selectedBox ) return;
      const subscription = forkJoin({
        outerColors: this.boxService.getCompatibleOuterMaterialsById(box.selectedBox._id),
        innerColors: this.boxService.getCompatibleInnerMaterialsById(box.selectedBox._id),
        details:     this.boxService.getCompatibleDetailMaterialsById(box.selectedBox._id)
      }).subscribe((res: any) => {

        if (res.outerColors.result === "OK") { this.outerColors = res.outerColors.outerMaterials; }
        if (res.innerColors.result === "OK") { this.innerColors = res.innerColors.innerMaterials; }
        if (res.details.result === "OK") { this.details = res.details.detailMaterials; }
      })
    });
  }

  printVars(): void {
  }

  moveDetailsBelowSelectedRow(index: number) {
    this.selectedCol = index;
    const itemArray = this.items.toArray();
    const rowEndIndex = Math.min(
      Math.floor(this.selectedCol / this.cols) * this.cols + (this.cols - 1),
      itemArray.length - 1,
    );
    
    if (!itemArray[rowEndIndex]) return;
    if ( !this.subsection ) return;

    itemArray[rowEndIndex].nativeElement.after(this.subsection.nativeElement);
  }

  onShapeClick(itemID: any, index?: number) {
    if (this.selectedBox() === itemID) {
      this.subsectionOpen = !this.subsectionOpen;
      this.moveDetailsBelowSelectedRow(this.selectedCol);
      return;
    } else {
      this.selectedBox.set(itemID);
      this.subsectionOpen = true;
    }
    this.editJewelService.editBoxShape(itemID);
    if (typeof index === 'number') {
      this.moveDetailsBelowSelectedRow(index);
    }
  }

  onExtColorClick(material: BoxOuterMaterial) {
    this.selectedOuterColor.set(material);
    this.editJewelService.editBoxOuterColor(material._id);
  }

  onIntColorClick(material: BoxInnerMaterial) {
    this.selectedInnerColor.set(material);
    this.editJewelService.editBoxInnerColor(material._id);
  }
}
