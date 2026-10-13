import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsSidebarComponent } from '../stats-sidebar/stats-sidebar.component';
import { ModifierCardComponent } from './modifier-card/modifier-card.component';
import { Box } from '../../../interfaces/box.interface';
import { BaseStructure } from '../../../interfaces/baseStructure.interface';
import { Setting } from '../../../interfaces/setting.interface';
import { Gemstone } from '../../../interfaces/gemStones.interface';
import { Profile } from '../../../interfaces/profile.interface';
import { Cut } from '../../../interfaces/cut.interface';
import { Material } from '../../../interfaces/material.interface';

import box from '../jsons/box.json';
import cut from '../jsons/cut.json';
import gem from '../jsons/gemstone.json';
import mat from '../jsons/material.json';
import { GlobalLookup } from './lookup.util';
import { BaseStructureService } from '../../../services/ringParts/base-structure.service';
import { MaterialService } from '../../../services/ringParts/material.service';
import { SettingService } from '../../../services/ringParts/setting.service';
import { ProfileService } from '../../../services/ringParts/profile.service';
import { CutService } from '../../../services/ringParts/cut.service';
import { BoxService } from '../../../services/ringParts/box.service';
import { GemService } from '../../../services/ringParts/gem.service';

enum ModifierCategory {
  BaseStructure = 'Estructura base',
  Material = 'Material',
  Setting = 'Engaste',
  Profile = 'Perfil',
  Box = 'Caja',
  Cut = 'Corte',
  Gemstone = 'Gema'
}

export interface ModifierRow {
  id: string;
  name: string;
  category: ModifierCategory;
  image?: string;
  model?: string;
  raw: BaseStructure | Material | Setting | Profile | Box | Cut | Gemstone;
}

@Component({
  selector: 'app-modifiersadmin',
  standalone: true,
  imports: [StatsSidebarComponent, ModifierCardComponent, CommonModule],
  templateUrl: './modifiersadmin.component.html',
  styleUrls: ['./modifiersadmin.component.scss']
})
export class ModifiersadminComponent {
  baseStructureService = inject(BaseStructureService);
  materialService = inject(MaterialService);
  settingService = inject(SettingService);
  profileService = inject(ProfileService);
  cutService = inject(CutService);
  boxService = inject(BoxService);
  gemtoneService = inject(GemService);

  // Signals
  baseStructures = signal<BaseStructure[]>([]);
  materials = signal<Material[]>([]);
  boxes = signal<Box[]>([]);
  settings = signal<Setting[]>([]);
  profiles = signal<Profile[]>([]);
  cuts = signal<Cut[]>([]);
  gemstones = signal<Gemstone[]>([]);

  // Effect para cargar datos al inicializar (correcto en field initializer)
  private loadData = effect(() => {
    this.settingService.getSettings().subscribe(res => this.settings.set(res.settings || []));
    this.baseStructureService.getBaseStructures().subscribe(res => this.baseStructures.set(res.baseStructures || []));
    this.materialService.getMaterials().subscribe(res => this.materials.set(res.materials || []));
    this.boxService.getBoxes().subscribe(res => this.boxes.set(res.boxes || []));
    this.gemtoneService.getGems().subscribe(res => this.gemstones.set(res.gemstones || []));
  });

  // Computed signal para unificar todo
  modifiers = computed<ModifierRow[]>(() => [
    ...this.settings().map(s => ({
      id: s._id,
      name: s.name,
      category: ModifierCategory.Setting,
      description: '',
      image: '',
      raw: s
    })),
    ...this.baseStructures().map(bs => ({
      id: bs._id,
      name: bs.name,
      category: ModifierCategory.BaseStructure,
      description: bs.description,
      image: '',
      raw: bs
    })),
    ...this.materials().map(m => ({
      id: m._id,
      name: m.name,
      category: ModifierCategory.Material,
      description: m.description,
      image: '',
      raw: m
    })),
    ...this.boxes().map(b => ({
      id: b._id,
      name: b.name,
      category: ModifierCategory.Box,
      description: b.description,
      image: b.image || '',
      model: b.model,
      raw: b
    })),
    ...this.gemstones().map(g => ({
      id: g._id,
      name: g.name,
      category: ModifierCategory.Gemstone,
      description: g.description,
      raw: g
    })),
  ]);

  constructor() {
    effect(() => {
      // Cada vez que cambien tus modifiers, actualizamos el "archivo" global
      GlobalLookup.update(this.modifiers());
    });
  }
}
