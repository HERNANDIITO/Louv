import { Component, inject, effect, signal, input, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faGem } from "@fortawesome/free-regular-svg-icons";
import { ItemComponent } from "../item/item.component";
import { Gemstone } from '../../../interfaces/gemStones.interface';
import { Cut } from '../../../interfaces/cut.interface';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';
import { BigSwitchComponent } from "../../../shared/big-switch/big-switch.component";
import { MultiSwitchComponent } from "../../../shared/multi-switch/multi-switch.component";

@Component({
  selector: 'app-gem-section',
  standalone: true,
  imports: [ItemComponent, FontAwesomeModule, BigSwitchComponent, MultiSwitchComponent],
  templateUrl: './gem-section.component.html',
  styleUrl: './gem-section.component.scss'
})
export class GemSectionComponent {
  private editJewelService = inject(EditJewelService);
  
  faWarning = faExclamationTriangle;
  faCircleInfo = faCircleInfo;
  faGem = faGem
  isChecked = false;

  // Listas que vienen del EditorComponent
  gemStones = input.required<Gemstone[]>();
  cuts = input.required<Cut[]>();

  // Vinculamos signals globales
  jewel = this.editJewelService.jewel;
  selectedGemIndex = this.editJewelService.selectedGemIndex;
  filteredEmbededSettings = this.editJewelService.filteredEmbededSettings;

  // Signals locales para los objetos completos de la API
  selectedGem = signal<Gemstone | undefined>(undefined);
  selectedCut = signal<Cut | undefined>(undefined);

  someIncompatible = computed(() => {
    const idx = this.selectedGemIndex();
    const setting = this.editJewelService.getSetting(idx);
    
    return (setting?.compatibleCuts && this.cuts().length > setting?.compatibleCuts?.length) ?? false;

  });

  // ------------------VARIABLES DE GEMAS DE PATRÓN ---------------------------
  selectedPatternGem = signal<Gemstone | undefined>(undefined);
  selectedPatternGroupIndex = signal<number>(0);

  // Opciones de gemas principals a editar
  gemOptions = computed(() => {
    return this.filteredEmbededSettings().map((_, index) => `Gema ${index + 1}`);
  });

  patternSettingIndex = computed(() => {
    return this.jewel().settings.findIndex(
      (setting) => setting.pattern != null
    );
  });

  // Obtenemos el tipo de garra actual para ver sus patrones disponibles
  selectedClawTypeObj = computed(() => {
    const patternSetting = this.jewel().settings.filter((setting) => {
      return setting.pattern !== undefined && setting.pattern !== null;
    });

    if(patternSetting.length > 0){ // Ahora mismo solo se devuelve un engaste con patrón porque solo podemos tener ese caso, pero igual podría existir un diseño que permita dos
      const patternClawType = this.editJewelService.getCatalog().settings.find((setting) => {
        return setting._id === patternSetting[0].id
      })
      ?.clawNumber?.[0]
      ?.compatibleCuts?.[0]
      ?.clawType?.[0];

      return patternClawType;
    }
     return undefined;
    
  });

  // Obtenemos los grupos únicos que tiene el patrón seleccionado actualmente
  patternGroups = computed(() => {
    const setting = this.jewel().settings[this.patternSettingIndex()];

    if (!setting?.pattern?.gem) return [];
    const groups = setting?.pattern?.gem.map(g => g.groupNumber);
    return [...new Set(groups)].sort(); // Quita duplicados y ordena
  });

  patternGroupOptions = computed(() => {
    return this.patternGroups().map(group => `Grupo ${group+1}`);
  });

  currentGroupGemId = computed(() => {
    const groupNum = this.patternGroups()[this.selectedPatternGroupIndex()];
    const setting = this.jewel().settings[this.patternSettingIndex()];
    // Buscamos la gema que pertenece a este grupo en el pattern.gem array
    return setting?.pattern?.gem.find(g => g.groupNumber === groupNum)?.id;
  });

  constructor() {
    /**
     * Reacciona a cambios en la joya o en la gema seleccionada.
     * Recupera los datos de la gema y el corte actuales.
     */
    effect(async () => {
      const idx = this.selectedGemIndex();
      const currentJewel = this.jewel();

      if (currentJewel?.settings && idx >= 0 && idx < currentJewel.settings.length) {
        // Pedimos ambos en paralelo
        const [gem, cut] = await Promise.all([
          this.editJewelService.getGem(idx),
          this.editJewelService.getCut(idx)
        ]);

        this.selectedGem.set(gem);
        this.selectedCut.set(cut);
      }
    });
  }

  /**
   * Lee el estado sintético directamente de la fuente de verdad (el signal jewel)
   */
  isSynthetic(): boolean {
    const idx = this.selectedGemIndex();
    return this.jewel().settings[idx]?.gem.synthetic ?? false;
  }

  isCompatible(cutID: string): boolean {
    const idx = this.selectedGemIndex();
    if (!cutID) return false;
    
    const setting = this.editJewelService.getSetting(idx);
    return !!setting?.compatibleCuts?.some((c: any) => c.cut === cutID); // Devuelve un booleano (!!)
  }

  onGemClick(itemID: string) {
    // Mantenemos el estado de "sintético" al cambiar de gema
    this.editJewelService.editGem(this.selectedGemIndex(), itemID, this.isSynthetic());
  }

  onCutClick(itemID: string) {
    this.editJewelService.editCut(this.selectedGemIndex(), itemID);
  }

  onSyntheticToggle(value: boolean) {
    this.isChecked = value;
    this.editJewelService.editIsSynthetic(this.selectedGemIndex(), this.isChecked);
  }

  // PATRONES
  onPatternClick(patternID: string) {
    this.editJewelService.editPattern(this.patternSettingIndex(), patternID);
  }

  onGroupGemChange(groupNum: number, gemId: string) {
    const selectedGemstoneType = this.editJewelService.getCatalog().gems.find((gem) => 
      gem._id.toString() === gemId.toString()
    );
    this.selectedPatternGem.set(selectedGemstoneType);

    this.editJewelService.editPatternGroupGem(this.patternSettingIndex(), groupNum, gemId);
  }

  updateSelectedGroup(index: number) {
    this.selectedPatternGroupIndex.set(index);
  }

  isSyntheticPat(): boolean {
    const idx = this.patternSettingIndex();
    return this.jewel().settings[idx]?.pattern?.gem.find((gem) => gem.groupNumber===this.selectedPatternGroupIndex())?.synthetic ?? false;
  }

  onSyntheticPatToggle(value: boolean) {
    const idx = this.patternSettingIndex();
    this.editJewelService.editIsSyntheticPat(idx, this.selectedPatternGroupIndex(), value);
  }

  // SELECCION GEMAS PRINCIPALES
  updateSelectedIndex(index: number) {
    this.editJewelService.editSelectedGem(index);
  }
}