import { Component, ElementRef, OnDestroy, ViewChild, computed, effect, inject, input, model, signal, untracked } from '@angular/core';
import { FacadeThreejsService } from '../../services/engineFacades/facade-threejs.service';
import { FacadeWebGLService } from '../../services/engineFacades/facade-webgl.service';
import { EditJewelService } from '../../services/editorServices/editJewel.service';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { assetHelper } from '../../helpers/asset.helper';
import { FacadeThreejs } from '../../classes/engines/threejs/interface-threejs.class';


@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss'],
  imports: [LoadingSpinnerComponent],
  providers: [ FacadeThreejsService, FacadeThreejs ]
})
export class EngineComponent implements OnDestroy {
  
  @ViewChild('rendererCanvas', { static: false }) set rendererCanvas(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._rendererCanvas = content;
      this.initSelectedEngine();
    }
  }

  private _rendererCanvas!: ElementRef<HTMLCanvasElement>;
  
  private isEngineReady = signal(false);
  public isLoading = signal(false);

  // Inputs como Signals
  engineSelector = input.required<boolean>();
  selectedEngine = computed(() => this.engineSelector() ? this.webGLEngine : this.threeJSEngine);
  autoRotation = input<boolean>(true);
  mini = input<boolean>(false);
  noBackground = input<boolean>(false);
  expanded = input<boolean>(false);
  forceload = input<boolean>(false);
  
  // Servicios
  private editJewelService = inject(EditJewelService);
  private threeJSEngine = inject(FacadeThreejsService);
  private webGLEngine = inject(FacadeWebGLService);

  constructor() {

    /**
     * Limpieza de motor al cambiar
     * Se encarga de parar el motor anterior.
     */
    effect((onCleanup) => {
      const engine = this.selectedEngine();
      
      onCleanup(() => {
        // Antes de cambiar al nuevo motor o destruir el componente, paramos el actual
        this.isEngineReady.set(false);
        engine?.destroyScene();
      });
    });

    /**
     * Reacción al cambio de la joya
     * Sustituye a la suscripción jewel$.pipe(...).subscribe(...)
     */
    effect(async () => {
      const jewel = this.editJewelService.jewel();
      const oldJewel = this.editJewelService.oldJewel();
      const ready = this.isEngineReady();
      const engine = this.selectedEngine(); 

      // let jewelChanged: boolean = this.forceload();

      const forceFullReload = untracked(() => ready);
      // Comprobamos si solo ha cambiado el nombre para evitarnos una recarga completa

      // 1. Comprobar que el name ha cambiado
      const nameChanged = jewel?.name !== oldJewel?.name;

      // 2. Clonar sin el campo name
      const { name: _, ...jewelRest } = jewel || {};
      const { name: __, ...oldJewelRest } = oldJewel || {};

      // 3. Comparar el resto
      const restIsEqual = JSON.stringify(jewelRest) === JSON.stringify(oldJewelRest);

      // Resultado final
      if (nameChanged && restIsEqual) return;

      // if (jewel.name != oldJewel.name) jewelChanged = true;

      // 1. Validaciones iniciales
      if (!ready || !jewel.baseStructure || !jewel.material || !engine) return;
      
      // flag para el spinner de carga, que se cambiará en el finally
      let jewelChanged: boolean = this.forceload() || forceFullReload;

      try {
        this.isLoading.set(true)
        // Recuperamos catálogos necesarios
        const material = this.editJewelService.getMaterial();
        const profile  = this.editJewelService.getProfile();
        const variant  = this.editJewelService.getVariant();
        const purity   = this.editJewelService.getPurity();
        
        // Si el usuario cambió de joya mientras esperábamos los catálogos, abortamos
        if ( !material || !profile || !variant || !purity ) { return; } 

        const gemCatalogMap = new Map(
          this.editJewelService.getCatalog().gems.map(g => [String(g._id), g.texture])
        );
        // CARGA DE BASE 
        // Es vital cargar la base primero porque ella crea el objeto 'Ring' en el motor
        const baseChanged = forceFullReload || 
                        jewel.variant !== oldJewel.variant || 
                        jewel.material !== oldJewel.material;

        if ( baseChanged || jewelChanged) {
          if(profile.model && purity) {
              await engine.loadBaseStructure(profile.model, purity.texture);
          }
  
          // LIMPIEZA TOTAL (Crítico para el cambio de 3 gemas a 1)
          // Borramos todos los engastes que hubiera de la variante anterior
          if (jewel.settings.length !== oldJewel.settings.length || oldJewel.settings.length == 0 && jewel.settings.length == 0) {
            engine.removeAllSettings(); 
            this.editJewelService.resetModelUUIDs();
          }
        }
        
        const roundCut = this.editJewelService.getCatalog().cuts.find((cut) => cut.name === "Brillante") || this.editJewelService.getCatalog().cuts[0];
        // BUCLE DE CARGA DE PIEZAS
        for (const [index, settingInfo] of variant.settingsInfo.entries()) {

          if (index === undefined) continue;
          
          // Comprobación de seguridad en cada iteración
          let settingChanged: boolean = this.forceload() || forceFullReload;
          let gemChanged: boolean     = this.forceload() || forceFullReload;
          let patternChanged: boolean = this.forceload() || forceFullReload;
          
          if (!forceFullReload) {
            // Comprobamos que ha cambiado la clawType o clawnumber o setting
            if ( jewel.settings[index]?.clawType !== oldJewel.settings[index]?.clawType ) settingChanged = true;
            if ( jewel.settings[index]?.clawNumber === oldJewel.settings[index]?.clawNumber ) settingChanged = true;
            if ( jewel.settings[index]?.id === oldJewel.settings[index]?.id ) settingChanged = true;
          }

          const clawType = this.editJewelService.getClawType(index);
          if (!clawType) continue;

          // Preparar coordenadas
          const data = settingInfo.positionAndRotationPerSettingSize[0];
          const pos = { 
            x: this.parseMongo(data.positionX), 
            y: this.parseMongo(data.positionY), 
            z: this.parseMongo(data.positionZ) 
          };
          const rot = { 
            x: this.parseMongo(data.rotationX), 
            y: this.parseMongo(data.rotationY), 
            z: this.parseMongo(data.rotationZ), 
            w: this.parseMongo(data.rotationW) 
          };

          const settingData = this.editJewelService.getSetting(index);
          const settingSizes = this.editJewelService.getSettingsSize();
          
          const matchedSetting = settingInfo.compatibleSettings.find(
            (item) => {
              return String(item.setting).trim() === String(settingData?._id).trim()
            }
          );
          const settingScale = matchedSetting?.scalePerSettingSize.find((item) =>  item.size[0] === settingSizes)?.scale || 1;

          // CARGAR ENGATE 
          // Usamos await para garantizar que el engaste existe en el motor antes de seguir
          if ( !purity ) return;

          // Si ha cambiado algo volvemos a cargar
          if ( settingChanged || jewelChanged ) await engine.loadSetting(clawType.model, purity.texture, index, pos, rot, this.parseMongo(settingScale));

          // CARGAR GEMA
          // Solo después de que loadSetting ha terminado, pedimos los datos de la gema

          if ( jewel.settings[index]?.gem.id !== oldJewel.settings[index]?.gem.id ) gemChanged = true;
          if ( jewel.settings[index]?.gem.cut !== oldJewel.settings[index]?.gem.cut ) gemChanged = true;
          if ( jewel.settings[index]?.gem.synthetic !== oldJewel.settings[index]?.gem.synthetic ) gemChanged = true;

          const cut = this.editJewelService.getCut(index);
          const gem = this.editJewelService.getGem(index);

          if (cut && gem) {
            const gemPos = { 
                x: this.parseMongo(clawType.gemPositionX), 
                y: this.parseMongo(clawType.gemPositionY), 
                z: this.parseMongo(clawType.gemPositionZ) 
            };
            const gemRot = { 
                x: this.parseMongo(clawType.gemRotataionX), 
                y: this.parseMongo(clawType.gemRotataionY), 
                z: this.parseMongo(clawType.gemRotataionZ), 
                w: this.parseMongo(clawType.gemRotataionW) 
            };
            
            // Cargar gema en el engaste recién creado
            if (gemChanged || settingChanged || jewelChanged || this.forceload()) await engine.loadGemstone(cut.model, gem.texture, index, index, gemPos, gemRot, 1);
            
            // --- CARGAR PATRÓN ---
            if ( jewel.settings[index]?.pattern?.gem !== oldJewel.settings[index]?.pattern?.gem ) patternChanged = true;
            if ( jewel.settings[index]?.pattern?.pattern !== oldJewel.settings[index]?.pattern?.pattern ) patternChanged = true;

            const patternDef = this.editJewelService.getPattern(index);
            const userPatternConfig = jewel.settings[index]?.pattern;

            if (patternDef?.gemstones && userPatternConfig?.gem && patternChanged) {
                // Mapa de elecciones del usuario
                const userGroupChoicesMap = new Map(
                    userPatternConfig.gem.map(g => [this.parseMongo(g.groupNumber), g])
                );

                // Agrupar promesas para no bloquear el bucle
                const patternPromises = patternDef.gemstones.map((gemData:any, gIdx:any) => {
                    const groupId = this.parseMongo(gemData.groupNumber);
                    const userChoice = userGroupChoicesMap.get(groupId);
                    
                    // Busqueda en el mapa del catálogo que creamos arriba
                    const selectedTexture = userChoice ? gemCatalogMap.get(String(userChoice.id)) : null;

                    if (!selectedTexture) return Promise.resolve();

                    const patternGemIdx = (index + 1) * 1000 + gIdx; 

                    return engine.loadGemstone(
                        roundCut.model, 
                        selectedTexture, 
                        index, 
                        patternGemIdx, 
                        { x: this.parseMongo(gemData.gemPositionX), y: this.parseMongo(gemData.gemPositionY), z: this.parseMongo(gemData.gemPositionZ) }, 
                        { x: this.parseMongo(gemData.gemRotationX), y: this.parseMongo(gemData.gemRotationY), z: this.parseMongo(gemData.gemRotationZ), w: this.parseMongo(gemData.gemRotationW) }, 
                        this.parseMongo(gemData.scaleFactor)
                    );
                });

                // Esperamos a que todas las gemas del patrón se carguen en paralelo
                await Promise.all(patternPromises);
            }
          }
        }

        // CARGAMOS LAS CAJAS
        const box = this.editJewelService.getBox();
        if (box === undefined || !box.selectedBox || !box.selectedInner || !box.selectedOuter) return;

        const modelPath = assetHelper.getRouteByName(box.selectedBox.model, 'three')
        const innerMaterial = box.selectedInner.texture || "whiteSilk";
        const outerMaterial = box.selectedOuter.texture || "redLeather";

        if ( !modelPath ) return;
        engine.loadBox(modelPath, innerMaterial, outerMaterial, "whiteGold");

      } catch (error) {
      } finally {
          this.isLoading.set(false);
      }
    });
    

    /**
     * Effect para Rotación Automática
     */
    effect(() => {
      this.selectedEngine().toggleAutoRotation(this.autoRotation());
    });
  }


  private async initSelectedEngine() {
    if (!this._rendererCanvas || !this.selectedEngine) return;

    try {
      // Bloqueamos el efecto de carga de la joya
      this.isEngineReady.set(false);
      this.isLoading.set(true);
       
       await new Promise(resolve => setTimeout(resolve, 50));

      await this.selectedEngine().createScene(this._rendererCanvas);
      this.selectedEngine().animate();

      // Desbloqueamos la carga de la joya
      this.isEngineReady.set(true);
    } catch (err) {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.selectedEngine()?.destroyScene();
  }

  private parseMongo(value: any): number {
    return parseFloat(value?.$numberDecimal ?? value ?? 0);
  }

  public getScreenshot(): string {
    return this.selectedEngine().getScreenshot(); 
  }

  // Animation control methods
  public playSceneAnimation(): void {
    this.selectedEngine().playSceneAnimation();
  }

  public stopSceneAnimation(): void {
    this.selectedEngine().stopSceneAnimation();
  }
}