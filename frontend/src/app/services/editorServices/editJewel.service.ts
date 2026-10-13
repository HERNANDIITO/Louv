import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { JewelModel, NewJewel, newJewel } from '../../interfaces/jewel.interface';
import { BaseStructure } from '../../interfaces/baseStructure.interface';
import { Material } from '../../interfaces/material.interface';
import { Setting } from '../../interfaces/setting.interface';
import { Gemstone } from '../../interfaces/gemStones.interface';
import { Cut } from '../../interfaces/cut.interface';
import { AuthService } from '../auth.service';
import { Size } from '../../interfaces/size.interface';
import { Box, BoxDetailMaterial, BoxInnerMaterial, BoxOuterMaterial } from '../../interfaces/box.interface';
import { forkJoin } from 'rxjs';
import { BaseStructureService } from '../ringParts/base-structure.service';
import { SizesService } from '../ringParts/size.service';
import { MaterialService } from '../ringParts/material.service';
import { SettingService } from '../ringParts/setting.service';
import { GemService } from '../ringParts/gem.service';
import { CutService } from '../ringParts/cut.service';
import { BoxService } from '../ringParts/box.service';

@Injectable({
    providedIn: 'root'
})
export class EditJewelService {
    private authService = inject(AuthService);
    private baseService = inject(BaseStructureService);
    private sizesService = inject(SizesService);
    private materialService = inject(MaterialService);
    private gemService = inject(GemService);
    private settingService = inject(SettingService);
    private cutService = inject(CutService);
    private boxService = inject(BoxService);

    debug = false;

    // --- ESTADO REACTIVO ---
    jewel = signal<NewJewel>(newJewel());
    oldJewel = signal<NewJewel>(newJewel());
    ringSaved = signal<boolean>(true);

    selectedGemIndex = signal<number>(0);
    selectedObject = signal<string>('');
    selectedCategory = signal<string>('');

    catalogsLoaded = signal<boolean>(false);
    private catalogs = {
        bases: [] as BaseStructure[],
        sizes: [] as Size[],
        materials: [] as Material[],
        gems: [] as Gemstone[],
        settings: [] as Setting[],
        cuts: [] as Cut[],
        boxes: [] as Box[],
        innerColors: [] as BoxInnerMaterial[],
        outerColors: [] as BoxOuterMaterial[],
        detailColors: [] as BoxDetailMaterial[]
    };

    // Mapeo para el motor 3D
    private jewelModel: JewelModel = { baseStructure: '', settings: [], gems: [] };

    // Lista de settings que NO son de tipo embeded(incrustados)
    filteredEmbededSettings = computed(() => {
        // esto es para forzar que se ejcute el computed al detectar un cambio en la jewel, nada más
        this.jewel();

        const activeVariant = this.getVariant();
        const allSettings = this.catalogs.settings; // Traemos todos los engastes del catálogo

        if (!activeVariant?.settingsInfo || !allSettings.length) return [];

        return activeVariant.settingsInfo
            .map((settingPos, originalIndex) => ({ settingPos, originalIndex }))
            .filter(item => {
                const compatibleObj = item.settingPos.compatibleSettings?.[0]?.setting;

                const settingId = typeof compatibleObj === 'string' ? compatibleObj : compatibleObj?._id;

                const fullSetting = allSettings.find(s =>
                    (typeof s === 'string' ? s : s._id) === settingId
                );
                if (!fullSetting) return false;
                const isEmbeded = Array.isArray(fullSetting.type) && fullSetting.type.includes('embeded');

                return !isEmbeded;
            });
    });

    constructor() {
        effect(() => {
            
            const current = this.jewel();
            
            if (this.shouldSave(current)) {
                sessionStorage.setItem('editor_jewel', JSON.stringify(current));
            } else {
                sessionStorage.removeItem('editor_jewel');
            }

        });
    }

    // --- HELPERS DE DATOS ---

    private getID(entity: any): string {
        if (!entity) return '';
        return typeof entity === 'string' ? entity : (entity._id || '');
    }

    setCatalogs(data: any) {
        this.catalogs = {
            bases: data.bases || [],
            sizes: data.sizes || [],
            materials: data.materials || [],
            gems: data.gems || [],
            settings: data.settings || [],
            cuts: data.cuts || [],
            boxes: data.boxes || [],
            innerColors: data.innerMaterials || [],
            outerColors: data.outerMaterials || [],
            detailColors: data.detailMaterials || []
        };
        this.catalogsLoaded.set(true);
    }

    async ensureCatalogs(): Promise<void> {
        if (this.catalogsLoaded()) return; // Si ya están, no hacemos nada

        return new Promise((resolve, reject) => {
            forkJoin({
                bases: this.baseService.getBaseStructures(),
                sizes: this.sizesService.getSizes(),
                materials: this.materialService.getMaterials(),
                gems: this.gemService.getGems(),
                settings: this.settingService.getSettings(),
                cuts: this.cutService.getCuts(),
                boxShapes: this.boxService.getBoxes(),
                innerMaterials: this.boxService.getInnerMaterials(),
                outerMaterials: this.boxService.getOuterMaterials(),
                detailMaterials: this.boxService.getDetailMaterials()
            }).subscribe({
                next: (res: any) => {
                    this.setCatalogs({
                        bases: res.bases.baseStructures,
                        materials: res.materials.materials,
                        gems: res.gems.gemstones,
                        settings: res.settings.settings,
                        cuts: res.cuts.cuts,
                        sizes: res.sizes.sizes,
                        boxes: res.boxShapes.boxes,
                        innerMaterials: res.innerMaterials.innerMaterials,
                        outerMaterials: res.outerMaterials.outerMaterials,
                        detailMaterials: res.detailMaterials.detailMaterials
                    });
                    this.catalogsLoaded.set(true);
                    resolve();
                },
                error: (err) => reject(err)
            });
        });
    }

     private notifyChange() {
        this.ringSaved.set(false);
      }

    private mapDefaultSettings(variantObj: any) {
        return variantObj?.settingsInfo?.map((info: any) => {
            const def = info.defaultSettings?.[0] || {};

            // Obtenemos los IDs básicos
            const settingId = this.getID(def.setting);
            const clawNumberId = this.getID(def.clawNumber);
            const clawTypeId = this.getID(def.clawType);
            const cutId = this.getID(def.gemstoneCut);

            // --- LÓGICA DE PATRONES POR DEFECTO ---
            let defaultPatternConfig = undefined;

            // Buscamos el objeto completo del clawType dentro del catálogo de settings para ver si tiene patrones
            const settingObj = this.catalogs.settings.find(s => this.getID(s) === settingId);
            const clawNumObj = settingObj?.clawNumber?.find(cn => this.getID(cn) === clawNumberId);
            const compCut = clawNumObj?.compatibleCuts?.find(cc => this.getID(cc.cut) === cutId);
            const clawTypeObj = compCut?.clawType?.find(ct => this.getID(ct) === clawTypeId);

            if (clawTypeObj?.availablePatterns && clawTypeObj.availablePatterns.length > 0) {
                const firstPattern = clawTypeObj.availablePatterns[0];
                const patternGemCutId = this.getID(this.catalogs.cuts[0]); // Brillante por defecto

                defaultPatternConfig = {
                    pattern: this.getID(firstPattern),
                    gem: firstPattern.gemstones.map((gemData: any) => ({
                        id: this.getID(this.catalogs.gems[0]), // Diamante por defecto
                        synthetic: false,
                        cut: patternGemCutId,
                        groupNumber: gemData.groupNumber
                    }))
                };
            }

            return {
                id: settingId,
                clawNumber: clawNumberId,
                clawType: clawTypeId,
                gem: {
                    id: this.getID(def.gemstone),
                    synthetic: false,
                    cut: cutId
                },
                pattern: defaultPatternConfig // Añadimos el patrón si existe
            };
        }) ?? [];
    }

    // --- ACCIONES DE SELECCIÓN ---
    setDefaultJewel() {
        const firstBase = this.catalogs.bases[0];
        const firstSize = this.catalogs.sizes[0];
        const firstProfile = firstBase?.profiles?.[0];
        const firstVariant = firstProfile?.variants?.[0];
        const defMat = this.catalogs.materials.find((m: any) => this.getID(m) === this.getID(firstBase?.defaultDesign?.material)) || this.catalogs.materials[0];
        
        this.oldJewel.set(newJewel())
        this.jewel.set({
            name: "Nuevo diseño",
            baseStructure: this.getID(firstBase),
            size: this.getID(firstSize),
            profile: this.getID(firstProfile?.profile),
            variant: this.getID(firstVariant),
            material: this.getID(defMat),
            purity: this.getID(defMat?.purities?.[0]),
            settingsSize: "medium",
            settings: this.mapDefaultSettings(firstVariant),
            box: {
                shape: '', outerColor: '', innerColor: '', details: ''
            }
        });
    }

    getDefaultJewel() {
        const firstBase = this.catalogs.bases[0];
        const firstSize = this.catalogs.sizes[0];
        const firstProfile = firstBase?.profiles?.[0];
        const firstVariant = firstProfile?.variants?.[0];
        const defMat = this.catalogs.materials.find((m: any) => this.getID(m) === this.getID(firstBase?.defaultDesign?.material)) || this.catalogs.materials[0];
        
        this.oldJewel.set(newJewel())
        return {
            name: "Nuevo diseño",
            baseStructure: this.getID(firstBase),
            size: this.getID(firstSize),
            profile: this.getID(firstProfile?.profile),
            variant: this.getID(firstVariant),
            material: this.getID(defMat),
            purity: this.getID(defMat?.purities?.[0]),
            settingsSize: "medium",
            settings: this.mapDefaultSettings(firstVariant),
            box: {
                shape: '', outerColor: '', innerColor: '', details: ''
            }
        };
    }

    // --- EDITORES DE ESTRUCTURA ---

    editBaseStructure(baseID: string) {
        const base = this.catalogs.bases.find(b => this.getID(b) === baseID);
        if (!base) return;

        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const next = { ...current, baseStructure: baseID };
            const defProfile = base.defaultDesign?.profile || base.profiles[0]?.profile;
            next.profile = this.getID(defProfile);

            const activeProfile = base.profiles.find(p => this.getID(p.profile) === next.profile);
            const variantObj = activeProfile?.variants[0];

            next.variant = this.getID(variantObj);
            next.settings = this.mapDefaultSettings(variantObj);
            return next;
        });
    }

    editSize(sizeID: string) {
        this.jewel.update(current => ({
            ...current,
            size: sizeID
        }));
    }

    editProfile(profileID: string) {

        const base = this.getBaseStructure();
        if (!base) {
            return;
        }
        
        const nextProfileData = base.profiles.find(p => this.getID(p.profile) === profileID);
        if (!nextProfileData) {
            return;
        }

        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            // Buscamos la variante actual para saber su nombre
            const currentProfileData = base.profiles.find(p => this.getID(p.profile) === current.profile);
            const currentVariantObj = currentProfileData?.variants.find(v => this.getID(v) === current.variant);

            // Buscamos el nuevo perfil y la variante que se llame igual (o la primera por defecto)
            const nextProfileData = base.profiles.find(p => this.getID(p.profile) === profileID);
            const nextVariantObj = nextProfileData?.variants.find(v => v.name === currentVariantObj?.name) || nextProfileData?.variants[0];

            // Mapeamos los settings: si el actual es compatible se queda, si no, va al default
            const nextSettings = nextVariantObj?.settingsInfo?.map((info: any, index: number) => {
                const existing = current.settings[index];

                // Miramos si el ID del engaste actual existe en la lista de compatibles de la nueva variante (".some" busca si almenos uno coincide, dice true o false)
                const isCompatible = existing && info.compatibleSettings?.some(
                    (cs: any) => this.getID(cs.setting) === existing.id
                );

                if (isCompatible) {
                    return existing; // Mantenemos la configuración (gema, corte, etc.)
                } else {
                    // Si no es compatible, aplicamos la lógica de "mapDefaultSettings" aquí
                    const def = info.defaultSettings?.[0] || {};
                    return {
                        id: this.getID(def.setting),
                        clawNumber: this.getID(def.clawNumber),
                        clawType: this.getID(def.clawType),
                        gem: {
                            id: this.getID(def.gemstone),
                            synthetic: false,
                            cut: this.getID(def.gemstoneCut)
                        }
                    };
                }
            }) ?? [];

            return {
                ...current,
                profile: profileID,
                variant: this.getID(nextVariantObj),
                settings: nextSettings
            };
        });
    }

    editVariant(variantID: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const base = this.catalogs.bases.find(b => this.getID(b) === current.baseStructure);
            const profile = base?.profiles.find(p => this.getID(p.profile) === current.profile);
            const variantObj = profile?.variants.find(v => this.getID(v) === variantID);

            const newSize = (variantObj?.name === "3 gemas") ? "one-size" : "medium";

            if (!variantObj) return current;
            return { ...current, variant: variantID, settings: this.mapDefaultSettings(variantObj), settingsSize: newSize };
        });
        this.selectedGemIndex.set(0);
    }

    // --- EDITORES DE PIEZAS ---

    editMaterial(materialID: string) {
        const mat = this.catalogs.materials.find(m => this.getID(m) === materialID);
        if (!mat) return;
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => ({
            ...current, material: materialID, purity: this.getID(mat.purities[0])
        }));
    }

    editGem(index: number, id: string, synth: boolean = false) {
        this.notifyChange();
        this.updateSettingGemField(index, { id, synthetic: synth });
    }

    editCut(index: number, cutID: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            if (!settings[index]) return current;

            // Intentamos buscar compatibilidad en el engaste actual
            let setting = this.catalogs.settings.find(s => this.getID(s) === settings[index].id);
            let targetClawNumber = setting?.clawNumber?.find(cn =>
                cn.compatibleCuts?.some((cc: any) => this.getID(cc.cut) === cutID)
            );

            // Si el engaste actual no es compatible, buscamos el primer engaste del catálogo que sí lo sea
            if (!targetClawNumber) {
                setting = this.catalogs.settings.find(s =>
                    s.clawNumber?.some(cn =>
                        cn.compatibleCuts?.some((cc: any) => this.getID(cc.cut) === cutID)
                    )
                );

                // Re evaluamos el targetClawNumber con el nuevo engaste encontrado
                targetClawNumber = setting?.clawNumber?.find(cn =>
                    cn.compatibleCuts?.some((cc: any) => this.getID(cc.cut) === cutID)
                );
            }

            const compatibleCutInfo = targetClawNumber?.compatibleCuts?.find((cc: any) => this.getID(cc.cut) === cutID);
            const newClawType = this.getID(compatibleCutInfo?.clawType?.[0]);

            // Si después de buscar en todo el catálogo no hay nada (caso extremo), abortamos
            if (!targetClawNumber || !newClawType || !setting) {
                return current;
            }

            settings[index] = {
                ...settings[index],
                id: this.getID(setting), // Actualizamos el ID del engaste por si cambió
                clawNumber: this.getID(targetClawNumber),
                clawType: newClawType,
                gem: { ...settings[index].gem, cut: cutID }
            };

            return { ...current, settings };
        });
    }

    private updateSettingGemField(index: number, patch: any) {
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            if (!settings[index]) return current;
            settings[index] = { ...settings[index], gem: { ...settings[index].gem, ...patch } };
            return { ...current, settings };
        });
    }

    editSetting(index: number, id: string) {
        const settingObj = this.catalogs.settings.find(s => this.getID(s) === id);

        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            if (!settings[index] || !settingObj) return current;

            const currentCutID = settings[index].gem.cut;

            // Buscamos el clawNumber compatible con el corte actual o el primero por defecto
            let targetClawNumber = settingObj.clawNumber?.find(cn =>
                cn.compatibleCuts?.some((cc: any) => String(cc.cut) === String(currentCutID))
            ) || settingObj.clawNumber?.[0];

            // Buscamos el corte compatible
            let compatibleCut = targetClawNumber?.compatibleCuts?.find((cc: any) =>
                String(cc.cut) === String(currentCutID)
            ) || targetClawNumber?.compatibleCuts?.[0];

            if (!targetClawNumber || !compatibleCut) return current;

            // --- LÓGICA DE PATRONES ---
            const selectedClawTypeObj = compatibleCut.clawType?.[0];
            let defaultPatternConfig = undefined;

            if (selectedClawTypeObj?.availablePatterns && selectedClawTypeObj.availablePatterns.length > 0) {
                const firstPattern = selectedClawTypeObj.availablePatterns[0];
                const patternGemCutId = this.getID(this.catalogs.cuts[0]);

                defaultPatternConfig = {
                    pattern: this.getID(firstPattern),
                    gem: firstPattern.gemstones.map((gemData: any) => ({
                        id: this.getID(this.catalogs.gems[0]),
                        synthetic: settings[index].gem.synthetic,
                        cut: patternGemCutId,
                        groupNumber: gemData.groupNumber
                    }))
                };
            }

            settings[index] = {
                ...settings[index],
                id: id,
                clawNumber: this.getID(targetClawNumber),
                clawType: this.getID(selectedClawTypeObj),
                gem: {
                    ...settings[index].gem,
                    cut: this.getID(compatibleCut.cut)
                },
                pattern: defaultPatternConfig
            };

            return { ...current, settings };
        });
    }

    editClawNumber(index: number, id: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            if (!settings[index]) return current;

            const settingDef = this.catalogs.settings.find(s => this.getID(s) === settings[index].id);
            const clawNumObj = settingDef?.clawNumber?.find(cn => this.getID(cn) === id); // Buscamos por el nuevo ID (nº garras)

            const currentCutID = settings[index].gem.cut;
            const compCut = clawNumObj?.compatibleCuts?.find(cc => this.getID(cc.cut) === currentCutID);
            const clawTypeObj = compCut?.clawType?.[0]; // Elegimos el primer tipo de garra por defecto

            let defaultPatternConfig = undefined;

            if (clawTypeObj?.availablePatterns && clawTypeObj.availablePatterns.length > 0) {
                const firstPattern = clawTypeObj.availablePatterns[0];
                defaultPatternConfig = {
                    pattern: this.getID(firstPattern),
                    gem: firstPattern.gemstones.map((gemData: any) => ({
                        id: this.getID(this.catalogs.gems[0]),
                        synthetic: settings[index].gem.synthetic,
                        cut: this.getID(this.catalogs.cuts[0]),
                        groupNumber: gemData.groupNumber
                    }))
                };
            }

            settings[index] = {
                ...settings[index],
                clawNumber: id, // Actualizamos el número de garras
                clawType: this.getID(clawTypeObj), // Actualizamos el tipo de garra al compatible
                pattern: defaultPatternConfig
            };

            return { ...current, settings };
        });
    }

    editClawType(index: number, id: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            if (!settings[index]) return current;

            // Actualizamos el ID del ClawType
            settings[index] = { ...settings[index], clawType: id };

            // Buscamos el objeto ClawType en el catálogo para ver sus patrones
            const settingDef = this.catalogs.settings.find(s => this.getID(s) === settings[index].id);
            const clawNumObj = settingDef?.clawNumber?.find(cn => this.getID(cn) === settings[index].clawNumber);
            const compCut = clawNumObj?.compatibleCuts?.find(cc => this.getID(cc.cut) === settings[index].gem.cut);
            const clawTypeObj = compCut?.clawType?.find(ct => this.getID(ct) === id);

            // Si tiene patrones, seleccionamos el primero por defecto
            const defaultPattern = clawTypeObj?.availablePatterns?.[0];

            if (defaultPattern) {
                const patternGemCutId = this.getID(this.catalogs.cuts[0]); // Por defecto Brillante
                settings[index].pattern = {
                    pattern: this.getID(defaultPattern),
                    gem: defaultPattern.gemstones.map((gemData: any) => ({
                        id: this.getID(this.catalogs.gems[0]), // Por defecto Diamante
                        synthetic: settings[index].gem.synthetic,
                        cut: patternGemCutId,
                        groupNumber: gemData.groupNumber
                    }))
                };
            } else {
                // Si el nuevo engaste no tiene patrones, limpiamos el estado
                settings[index].pattern = undefined;
            }

            return { ...current, settings };
        });
    }

    editPurity(id: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => ({ ...current, purity: id }));
    }

    editName(name: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => ({ ...current, name }));
    }

    editSettingsSize(settingsSize: string) {
      this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => ({ ...current, settingsSize: settingsSize }));
    }

    editSelectedGem(idx: number) {
        this.notifyChange();
        this.selectedGemIndex.set(idx);
    }

    editIsSynthetic(index: number, val: boolean) {
        this.notifyChange();
        this.updateSettingGemField(index, { synthetic: val });
    }

    editBoxShape(idx: string) {
        this.oldJewel.set({...this.jewel()});
        //Materiales por defecto
        const firstInnerColor = this.getCatalog().innerColors[0]._id;
        const firstOuterColor = this.getCatalog().outerColors[0]._id;
        const firstDetail = this.getCatalog().detailColors[0]._id;
        this.jewel.update(current => ({
            ...current, box: {
                shape: idx,
                outerColor: firstOuterColor,
                innerColor: firstInnerColor,
                details: firstDetail
            }
        }));
    }

    editBoxInnerColor(idx: string) {
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => ({
            ...current,
            box: {
                ...current.box,
                innerColor: idx
            }
        }));
    }

    editBoxOuterColor(idx: string) {
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => ({
            ...current,
            box: {
                ...current.box,
                outerColor: idx
            }
        }));
    }

    editPattern(index: number, patternID: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            const targetSetting = settings[index];
            if (!targetSetting) return current;

            // Buscamos la definición del patrón en el catálogo para saber cuántas gemas tiene y sus grupos
            const settingDef = this.catalogs.settings.find(s => this.getID(s) === targetSetting.id);
            const clawNumObj = settingDef?.clawNumber?.find((cn: any) => this.getID(cn) === targetSetting.clawNumber);
            const compCut = clawNumObj?.compatibleCuts?.find((cc: any) => this.getID(cc.cut) === targetSetting.gem.cut);
            const clawTypeObj = compCut?.clawType?.find((ct: any) => this.getID(ct) === targetSetting.clawType);

            const patternDef = clawTypeObj?.availablePatterns?.find((p: any) => this.getID(p) === patternID);
            const gemstonesDefinitions = patternDef?.gemstones || [];

            // Por defecto para el patrón usamos el primer corte del catálogo (Brillante/Round)
            const patternGemCutId = this.getID(this.catalogs.cuts[0]);

            settings[index] = {
                ...targetSetting,
                pattern: {
                    pattern: patternID,
                    gem: gemstonesDefinitions.map((gemInfo: any) => ({
                        id: this.getID(this.catalogs.gems[0]),
                        synthetic: targetSetting.gem.synthetic,
                        cut: patternGemCutId,
                        groupNumber: gemInfo.groupNumber
                    }))
                }
            };

            return { ...current, settings };
        });
    }

    // Cambia la gema de TODAS las partes de un grupo
    editPatternGroupGem(settingIndex: number, groupNum: number, gemstoneId: string) {
        this.notifyChange();
        this.oldJewel.set({...this.jewel()});
        this.jewel.update(current => {
            const settings = [...current.settings];
            const target = settings[settingIndex];

            if (target?.pattern?.gem) {
                target.pattern.gem = target.pattern.gem.map(g =>
                    g.groupNumber === groupNum ? { ...g, id: gemstoneId } : g
                );
            }

            return { ...current, settings };
        });
    }

    editIsSyntheticPat(settingIdx: number, groupNum: number, val: boolean) {
      this.notifyChange();
      this.jewel.update(currentJewel => {
        // Clonamos las settings para mantener la inmutabilidad
        const newSettings = [...currentJewel.settings];
        const pattern = newSettings[settingIdx]?.pattern;

        if (pattern && pattern.gem) {
          // Reemplazamos el array de gemas con uno nuevo que tenga el cambio
          pattern.gem = pattern.gem.map(g =>
            g.groupNumber === groupNum ? { ...g, synthetic: val } : g
          );
        }

        return { ...currentJewel, settings: newSettings };
      });
        
    }

    // --- CARGA Y TRANSFORMACIÓN (TRANSFORMERS) ---

    loadExistingJewel(data: any): void {
        sessionStorage.removeItem('editor_jewel');
        // Limpiar los UUIDs del modelo 3D anterior
        this.resetModelUUIDs();

        const newJewelObj = data.composition ? this.transformJewelryToNewJewel(data) : data;
        
        this.oldJewel.set(newJewel())
        this.jewel.set({ ...newJewelObj });
        this.selectedGemIndex.set(Math.floor((newJewelObj.settings?.length ?? 1) / 2));
    }

    private transformJewelryToNewJewel(jewelry: any): NewJewel {
        const comp = jewelry.composition;

        let sSize = "medium"; // Valor por defecto

        // Miramos si el tamaño viene en composition o en la raíz
        const rawSize = comp?.settingsSize || jewelry.settingsSize;

        if (rawSize) {
            // Si es un array, cogemos el primer elemento. Si no, lo usamos tal cual.
            sSize = Array.isArray(rawSize) ? rawSize[0] : rawSize;
        }
        // ya que los inclustados son siempre brillantes
        const patternGemCut = this.catalogs.cuts[0]._id;
        return {
            name: jewelry.name || "",
            baseStructure: this.getID(comp?.baseStructure),
            size: this.getID(comp?.size),
            profile: this.getID(comp?.profile),
            variant: this.getID(comp?.variant),
            material: this.getID(comp?.material),
            purity: this.getID(comp?.materialPurity),
            settingsSize: sSize,
            settings: comp?.settings?.map((s: any) => {

                const firstPattern = s.pattern && s.pattern.length > 0 ? s.pattern[0] : null;

                const settingDef = this.catalogs.settings.find(catS => this.getID(catS) === this.getID(s.setting));
                // Intentamos encontrar el patrón dentro de las estructuras de garras
                let patternDefinition: any = null;
                settingDef?.clawNumber?.forEach(cn => {
                    cn.compatibleCuts?.forEach((cc: any) => {
                        cc.clawType?.forEach((ct: any) => {
                            const foundP = ct.availablePatterns?.find((p: any) => this.getID(p) === this.getID(firstPattern?.pattern));
                            if (foundP) patternDefinition = foundP;
                        });
                    });
                });

                return {
                    id: this.getID(s.setting),
                    clawNumber: this.getID(s.clawNumber),
                    clawType: this.getID(s.clawType),
                    gem: {
                        id: this.getID(s.gemstone),
                        synthetic: s.isSynthetic || false,
                        cut: this.getID(s.gemstoneCut)
                    },
                    pattern: firstPattern ? {
                        pattern: this.getID(firstPattern.pattern),
                        gem: (firstPattern.gemstone || []).map((gemId: any, index: number) => ({
                            id: this.getID(gemId),
                            synthetic: firstPattern.isSynthetic ? (firstPattern.isSynthetic[index] || false) : false,
                            cut: patternGemCut,
                            // Si tenemos la definición, usamos el groupNumber original, si no, por defecto 0
                            groupNumber: patternDefinition?.gemstones?.[index]?.groupNumber ?? 0

                        }))
                    } : undefined
                };
            }) || [],
            box: {
                shape: this.getID(jewelry.box), outerColor: this.getID(jewelry.boxOuterColor), innerColor: this.getID(jewelry.boxInnerColor),
                details: ''
            }
        };
    }

    getJewelForSaving(): any {
        const j = this.jewel();

        return {
            name: j.name,
            timeSpent: 0,
            composition: {
                baseStructure: j.baseStructure,
                size: j.size,
                profile: j.profile || undefined,
                variant: j.variant || undefined,
                material: j.material,
                materialPurity: j.purity,
                settingsSize: [j.settingsSize],
                settings: j.settings.map(s => ({
                    setting: s.id,
                    gemstone: s.gem.id,
                    gemstoneCut: s.gem.cut || undefined,
                    isSynthetic: s.gem.synthetic,
                    clawNumber: s.clawNumber || undefined,
                    clawType: s.clawType || undefined,
                    pattern: s.pattern?.pattern ? [{
                        pattern: s.pattern.pattern,
                        gemstone: s.pattern.gem.map(g => g.id),
                        isSynthetic: s.pattern.gem.map(g => g.synthetic)
                    }] : []
                }))
            },
            box: j.box.shape || undefined,
            boxOuterColor: j.box.outerColor || undefined,
            boxInnerColor: j.box.innerColor || undefined
        };
    }

    public getCatalog() {
        return this.catalogs;
    }

    // --- GETTERS ASÍNCRONOS ---

    getBaseStructure() {
        return this.catalogs.bases.find(b => this.getID(b) === this.jewel().baseStructure);
    }

    getAllBaseStructures() {
        return this.catalogs.bases;
    }

    getMaterial() {
        return this.catalogs.materials.find(m => this.getID(m) === this.jewel().material);
    }

    getPurity() {
        const mat = this.getMaterial();
        const pur = mat?.purities.find(purity => purity._id === this.jewel().purity);
        return pur;
    }

    getProfile() {
        const base = this.getBaseStructure();
        return base?.profiles.find(p => this.getID(p.profile) === this.jewel().profile);
    }

    getVariant() {
        const profile = this.getProfile();
        return profile?.variants.find(v => this.getID(v) === this.jewel().variant);
    }

    getSetting(idx: number) {
        return this.catalogs.settings.find(s => this.getID(s) === this.jewel().settings[idx]?.id);
    }

    getGem(idx: number) {
        return this.catalogs.gems.find(g => this.getID(g) === this.jewel().settings[idx]?.gem.id);
    }

    getCut(idx: number) {
        return this.catalogs.cuts.find(c => this.getID(c) === this.jewel().settings[idx]?.gem.cut);
    }

    getBox() {

        const selectedBox = this.catalogs.boxes.find(box => this.getID(box) === this.jewel().box.shape);

        const selectedInner = this.catalogs.innerColors.find(inner => this.getID(inner) === this.jewel().box.innerColor);
        const selectedOuter = this.catalogs.outerColors.find(outer => this.getID(outer) === this.jewel().box.outerColor);
        const selectedDetails = this.catalogs.detailColors.find(detail => this.getID(detail) === this.jewel().box.details);

        return { selectedBox, selectedInner, selectedOuter, selectedDetails };
    }

    getClawNumber(idx: number) {
        const s = this.getSetting(idx);
        return s?.clawNumber?.find(cn => this.getID(cn) === this.jewel().settings[idx]?.clawNumber);
    }

    getClawType(idx: number) {
        const cn = this.getClawNumber(idx);
        let found: any;
        cn?.compatibleCuts?.forEach((cc: any) => {
            cc.clawType?.forEach((ct: any) => { if (this.getID(ct) === this.jewel().settings[idx]?.clawType) found = ct; });
        });
        return found;
    }

    getPattern(idx: number) {
        const ct = this.getClawType(idx);
        return ct?.availablePatterns?.find((pattern: any) => this.getID(pattern) === this.jewel().settings[idx]?.pattern?.pattern);
    }

    getSettingsSize() {
        return this.jewel().settingsSize;
    }

    getSize() {
        return this.jewel().size
    }

    // --- PERSISTENCIA ---

    resetJewel() {
        sessionStorage.removeItem('editor_jewel');
    }

    private shouldSave(j: NewJewel) {
        return JSON.stringify(j) !== JSON.stringify(newJewel());
    }

    getStoredJewel(): NewJewel | null {
        const s = sessionStorage.getItem('editor_jewel');
        return s ? JSON.parse(s) : null;
    }

    clearStoredJewel() {
        sessionStorage.removeItem('editor_jewel');
    }

    // --- MOTOR 3D UUIDS ---

    changeGemUUID(uuid: string, index: number) {
        this.jewelModel.gems[index] = uuid;
    }

    changeSettingUUID(uuid: string, index: number) {
        this.jewelModel.settings[index] = uuid;
    }

    changeBaseStructureUUID(uuid: string) {
        this.jewelModel.baseStructure = uuid;
    }

    getCategoryByUUID(uuid: string): string {
        if (this.jewelModel.baseStructure === uuid) return "baseStructure";
        if (this.jewelModel.settings.includes(uuid)) return "setting";
        if (this.jewelModel.gems.includes(uuid)) return "gem";
        return "error";
    }

    selectGemByUUID(category: string, uuid: string) {
        const index = category === 'gem' ? this.jewelModel.gems.indexOf(uuid) : this.jewelModel.settings.indexOf(uuid);
        if (index !== -1 && index < 1000) this.selectedGemIndex.set(index);
    }

    selectObjectByUUID(category: string, uuid: string) {
        this.selectedObject.set(uuid);
        this.selectedCategory.set(category);
    }

    resetModelUUIDs() {
        this.jewelModel.settings = [];
        this.jewelModel.gems = [];
    }
}