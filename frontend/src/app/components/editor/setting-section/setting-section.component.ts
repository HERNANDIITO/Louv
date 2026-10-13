import { Component, inject, effect, signal, input, computed, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ItemComponent } from "../item/item.component";
import { ClawNumber, ClawType, Setting } from '../../../interfaces/setting.interface';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';
import { Cut } from '../../../interfaces/cut.interface';
import { GemSelectionComponent } from "../gem-selection/gem-selection.component";
import { SETTING_TYPE } from '../../../interfaces/enums';
import { MultiSwitchComponent } from "../../../shared/multi-switch/multi-switch.component";

@Component({
  selector: 'app-setting-section',
  standalone: true,
  imports: [ItemComponent, FontAwesomeModule, MultiSwitchComponent],
  templateUrl: './setting-section.component.html',
  styleUrl: './setting-section.component.scss'
})
export class SettingSectionComponent {
  private editJewelService = inject(EditJewelService);

  @ViewChild('subsection') subsection!: ElementRef<HTMLElement>;
  @ViewChildren('item', { read: ElementRef }) items!: QueryList<ElementRef>

  faCircleInfo = faCircleInfo;
  section = input.required<Setting[]>();
  
  selectedItem: number = 1;

  cols: number = 3;
  selectedCol = signal<number>(0);
  subsectionOpen: boolean = true;

  // Vinculamos a los signals globales del servicio
  jewel = this.editJewelService.jewel;
  selectedGemIndex = this.editJewelService.selectedGemIndex;
  filteredEmbededSettings = this.editJewelService.filteredEmbededSettings;

  // Signals locales para los datos descriptivos de la UI
  selectedSetting = signal<Setting | undefined>(undefined);
  selectedClawNumber = signal<ClawNumber | undefined>(undefined);
  selectedClawType = signal<ClawType | undefined>(undefined);
  selectedCut = signal<Cut | undefined>(undefined);

  // Filtrar lo numeros de garra compatibles con el corte seleccionado
  filteredClawNumbers = computed(() => {
    const setting = this.selectedSetting();
    const currentCutId = this.selectedCut()?._id;

    if (!setting?.clawNumber || !currentCutId) return [];

    return setting.clawNumber.filter(clawNumber => 
      clawNumber.compatibleCuts?.some(cut => cut.cut === currentCutId)
    );
  });

  gemOptions = computed(() => {
    return this.filteredEmbededSettings().map((_, index) => `Gema ${index + 1}`);
  });

  protected readonly SETTING_TYPE = SETTING_TYPE;

  constructor() {
    /**
     * Reaccionamos a cambios en la joya o en qué gema está seleccionada.
     * Recuperamos toda la información necesaria de la API de forma atómica.
     */
    effect(async () => {
      const idx = this.selectedGemIndex();
      const currentJewel = this.jewel();

      // Validamos que el índice sea correcto dentro del array de settings
      if (currentJewel?.settings && idx >= 0 && idx < currentJewel.settings.length) {
        
        // Lanzamos las peticiones en paralelo para máxima velocidad
        const [setting, clawNum, clawType, cut] = await Promise.all([
          this.editJewelService.getSetting(idx),
          this.editJewelService.getClawNumber(idx),
          this.editJewelService.getClawType(idx),
          this.editJewelService.getCut(idx)
        ]);

        this.selectedSetting.set(setting);
        this.selectedClawNumber.set(clawNum);
        this.selectedClawType.set(clawType);
        this.selectedCut.set(cut);
      }
    });

    effect(() => {

      if ( this.items && this.items.toArray().length != 0 ) {
        this.moveDetailsBelowSelectedRow();
      }
    });
  }

  onSettingClick(itemID: string) {
    this.editJewelService.editSetting(this.selectedGemIndex(), itemID);

    if (this.selectedSetting()?._id === itemID) {
      this.subsectionOpen = !this.subsectionOpen;
      return;
    } else {
      this.subsectionOpen = true;
    }
  }

  onClawNumberClick(itemID: string) {
    this.editJewelService.editClawNumber(this.selectedGemIndex(), itemID);
  }

  onClawTypeClick(itemID: string) {
    this.editJewelService.editClawType(this.selectedGemIndex(), itemID);
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

  /**
   * Determina si un elemento es compatible con el corte de la gema seleccionada.
   * "true" significa que es compatible.
   */
  isCompatible(params: {  settingID?: string }, idx: number): boolean {
    const { settingID } = params;
    const cut = this.selectedCut();
    
    // Si no hay corte seleccionado aún, no bloqueamos la UI
    if (!cut) return true;

    if (settingID) {
      const variant = this.editJewelService.getVariant();
      const setting = this.section().find(s => s._id === settingID);
      return ( //Debe cumplir que el corte sea compatible con el engaste y que esa posición de la variante acepte ese engaste
        setting?.compatibleCuts?.some((c: any) => c.cut === cut._id) &&
        !!variant?.settingsInfo[idx].compatibleSettings.find(
          (s) => String(s.setting).trim() === settingID
        )
      ) ?? false;
    }

    return false;
  }


  updateSelectedIndex(index: number) {
    this.editJewelService.editSelectedGem(index);
  }
}