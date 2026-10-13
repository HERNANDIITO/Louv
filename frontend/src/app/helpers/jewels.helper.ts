import { NewJewel } from "../interfaces/jewel.interface";

export class JewelHelper {
    static getID(entity: any): string {
        if (!entity) return '';
        return typeof entity === 'string' ? entity : (entity._id || '');
    }

    static transformJewelryToNewJewel(jewelry: any, catalogs: any): NewJewel {
        const comp = jewelry.composition;

        let sSize = "medium"; // Valor por defecto

        // Miramos si el tamaño viene en composition o en la raíz
        const rawSize = comp?.settingsSize || jewelry.settingsSize;

        if (rawSize) {
            // Si es un array, cogemos el primer elemento. Si no, lo usamos tal cual.
            sSize = Array.isArray(rawSize) ? rawSize[0] : rawSize;
        }
        // ya que los inclustados son siempre brillantes
        const patternGemCut = catalogs.cuts[0]._id;
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

                const settingDef = catalogs.settings.find((catS: any) => this.getID(catS) === this.getID(s.setting));
                // Intentamos encontrar el patrón dentro de las estructuras de garras
                let patternDefinition: any = null;
                settingDef?.clawNumber?.forEach((cn:any) => {
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


    static getJewelForSaving(jewel: NewJewel): any {
      const j = jewel;
      
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

}


