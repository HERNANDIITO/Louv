import { Component, computed, DestroyRef, effect, ElementRef, inject, OnInit, signal, untracked, ViewChild, WritableSignal } from "@angular/core";
import { CurrencyPipe, Location } from "@angular/common";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faBars, faExpand, faFloppyDisk, faQuestion, faShareNodes, faChevronDown, faChevronUp, faArrowsRotate, faComputerMouse, faUpDownLeftRight, faMagnifyingGlass,
  faXmark,
  faChevronLeft,
  faPen,
  faChevronRight,
  faCheckCircle,
  faX,
  faCompress
} from "@fortawesome/free-solid-svg-icons";

// Componentes
import { GemSectionComponent } from "./gem-section/gem-section.component";
import { SettingSectionComponent } from "./setting-section/setting-section.component";
import { AccordionItemComponent } from "../../shared/accordion-item/accordion-item.component";
import { BaseSectionComponent } from "./base-section/base-section.component";
import { MaterialSectionComponent } from "./material-section/material-section.component";
import { EngineComponent } from "../../shared/engine/engine.component";

// Iconos

// Servicios e Interfaces
import { JewelService } from "../../services/jewel.service";
import { EditJewelService } from "../../services/editorServices/editJewel.service";
import { AuthService } from "../../services/auth.service";
import { BaseStructureService } from "../../services/ringParts/base-structure.service";
import { MaterialService } from "../../services/ringParts/material.service";
import { GemService } from "../../services/ringParts/gem.service";
import { CutService } from "../../services/ringParts/cut.service";
import { SettingService } from "../../services/ringParts/setting.service";
import { NewJewel } from "../../interfaces/jewel.interface";

import Swal from "sweetalert2";
import { debounceTime, first, forkJoin, Subject } from "rxjs";
import { BoxService } from "../../services/ringParts/box.service";
import { ControlsComponent } from "./controls/controls.component";
import { BigSwitchComponent } from "../../shared/big-switch/big-switch.component";
import { SwitchComponent } from "../../shared/switch/switch.component";
import { ShareComponent } from "./share/share.component";
import { SizesService } from "../../services/ringParts/size.service";
import { UserProfileDropwdownComponent } from "../../shared/user-profile-dropwdown/user-profile-dropwdown.component";
import { AlertHelper } from "../../helpers/alerts.helper";
import { Router } from '@angular/router';
import { OrderService } from "../../services/order.service";
import { TrackingService } from "../../services/tracking.service";
import { UiOverlayService } from "../../services/overlay.service";

@Component({
  selector: "app-editor3d",
  standalone: true,
  imports: [
    FontAwesomeModule, AccordionItemComponent, BaseSectionComponent,
    MaterialSectionComponent, GemSectionComponent, SettingSectionComponent,
    EngineComponent,
    ControlsComponent,
    BigSwitchComponent,
    SwitchComponent,
    RouterLink,
    ShareComponent,
    CurrencyPipe,
    UserProfileDropwdownComponent
  ],
  templateUrl: "./editor.component.html",
  styleUrl: "./editor.component.scss",
})
export class EditorComponent implements OnInit {
  // Iconos agrupados para el HTML
  icons = {
    faBars, faShareNodes, faFloppyDisk, faQuestion, faExpand, faChevronDown, faChevronUp, faArrowsRotate, faComputerMouse, faUpDownLeftRight, faMagnifyingGlass, faXmark,
    faChevronLeft, faPen, faChevronRight, faCheckCircle, faX, faCompress

  };

  // Inyectables
  public editJewelService = inject(EditJewelService); // Público para el HTML
  public authService = inject(AuthService);
  private jewelService = inject(JewelService);
  private baseStructureService = inject(BaseStructureService);
  private materialService = inject(MaterialService);
  private gemService = inject(GemService);
  private cutService = inject(CutService);
  private settingService = inject(SettingService);
  private boxService = inject(BoxService);
  private sizesServices = inject(SizesService);
  private orderService = inject(OrderService);
  private trackingService = inject(TrackingService);
  private overlayService = inject(UiOverlayService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);

  @ViewChild('sidebar') sidebar!: ElementRef<HTMLElement>;
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('engineComponent') engineComponent!: EngineComponent;

  @ViewChild('baseAccordion') baseAccordion!: AccordionItemComponent;
  @ViewChild('materialAccordion') materialAccordion!: AccordionItemComponent;
  @ViewChild('gemAccordion') gemAccordion!: AccordionItemComponent;
  @ViewChild('settingAccordion') settingAccordion!: AccordionItemComponent;
  @ViewChild('boxAccordion') boxAccordion!: AccordionItemComponent;

  @ViewChild('baseAccordion', { read: ElementRef }) baseAccordionEl!: ElementRef;
  @ViewChild('materialAccordion', { read: ElementRef }) materialAccordionEl!: ElementRef;
  @ViewChild('gemAccordion', { read: ElementRef }) gemAccordionEl!: ElementRef;
  @ViewChild('settingAccordion', { read: ElementRef }) settingAccordionEl!: ElementRef;
  @ViewChild('boxAccordion', { read: ElementRef }) boxAccordionEl!: ElementRef;

  // Datos de catálogos (Signals)
  baseStructures = signal<any[]>([]);
  materials = signal<any[]>([]);
  gems = signal<any[]>([]);
  sizes = signal<any[]>([]);
  settings = signal<any[]>([]);
  cuts = signal<any[]>([]);
  boxShapes = signal<any[]>([]);
  outerColors = signal<any[]>([]);
  innerColors = signal<any[]>([]);
  details = signal<any[]>([]);
  jewelID = signal<string | undefined>(undefined);
  currentSnapshot = signal<string | null>(null);

  // Estado de la interfaz (Signals)
  engineSelector = signal<boolean>(localStorage.getItem('isWebGL') === 'true');
  autoRotation = signal<boolean>(localStorage.getItem('autoRotation') ? localStorage.getItem('autoRotation') === "true" : true);
  expandedView = signal<boolean>(false);
  finalView = signal<boolean>(false);
  menuOpen = signal<boolean>(false);
  shareOpen = signal<boolean>(false);
  isReady = signal(false);
  justDownload = signal(false);

  showControls = false;
  debugMode = false;  

  inputWidth = signal<number>(12);
  // Precio
  public currentPrice = signal<number>(0);
  public fullPrice = signal<any>({});
  public isLoadingPrice = signal<boolean>(false);
  priceOpen = false;
  resizeInterval: number | undefined;

  private nameInput$ = new Subject<string>();
  private editStartTime: number = Date.now();


  constructor() {

    effect((onCleanup) => {

      this.editJewelService.jewel();
      this.adjustInputWidth(this.editJewelService.jewel().name);
      this.isLoadingPrice.set(true);
      // esperamos 500ms antes de llamar al API para no saturar
      const timeout = setTimeout(async () => {
        const payload = this.editJewelService.getJewelForSaving();

        // Para obtener los datos de la base tanto forma como metal utilizados
        const base = this.editJewelService.getBaseStructure();
        const profile = this.editJewelService.getProfile();
        const variant = this.editJewelService.getVariant();
        const material = this.editJewelService.getMaterial();
        const purity = this.editJewelService.getPurity();

        if (payload.baseStructure === "" ) {
          this.currentPrice.set(0);
          this.fullPrice.set({});
          this.isLoadingPrice.set(false);
          return;
        }

        this.jewelService.getPriceQuote(payload).subscribe({
          next: (res: any) => {
            this.fullPrice.set({
              basePrice: Number(res.quote.basePrice).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              }),
              baseName: base?.name,
              profileName: profile?.profile.name,
              variantName: variant?.name,
              material: material?.name,
              purity: purity?.purity,
              gemsPrice: res.quote.gemsPrice,
              settingPrice: res.quote.settingsPrice,
              taxes: res.quote.taxes,
            })

            this.currentPrice.set(res.quote.taxablePrice);
            this.isLoadingPrice.set(false);
          },
          error: (err) => {
            console.log("ERROR COTIZACIÓN", err);
            this.isLoadingPrice.set(false);

          }
        });
      }, 500);

      // Si el signal vuelve a cambiar antes de los 500ms, cancelamos el timer anterior
      onCleanup(() => clearTimeout(timeout));
    });

    effect(() => {
      const selectedObject = this.editJewelService.selectedObject();
      const selectedCategory = this.editJewelService.selectedCategory();

      switch (selectedCategory) {
        case 'baseStructure':
          this.baseAccordion.open.set(true);
          if (this.isElementInViewport(this.baseAccordionEl.nativeElement)) return;
          this.scrollWithDelay(this.baseAccordionEl.nativeElement);
          break;
        case 'setting':
          this.settingAccordion.open.set(true);
          if (this.isElementInViewport(this.settingAccordionEl.nativeElement)) return;
          this.scrollWithDelay(this.settingAccordionEl.nativeElement);
          break;
        case 'gem':
          this.gemAccordion.open.set(true);
          if (this.isElementInViewport(this.gemAccordionEl.nativeElement)) return;
          this.scrollWithDelay(this.gemAccordionEl.nativeElement);
          break;
        default:
          break;
      }

    });
  }

  openMyDesigns() {
    if(!this.isUserAuthenticated()) return;
    this.overlayService.openProfile();
  }

  isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const threshold = 0.5;

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    const elementHeight = rect.height;

    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);

    const visibleRatio = visibleHeight / elementHeight;

    return visibleRatio > threshold;
  
  }

  scrollWithDelay(el: HTMLElement) {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  toLocalePrice(price: string) {
    return Number(price).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    })
  }

  ngOnInit() {
    // Recogemos entrada a editor para estadísticas
    this.trackingService.trackEditorAccess();

    // Se comprueba si la ruta contiene un id de anillo, y si es el caso se guarda el id
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jewelID.set(id);
      }else{
        this.jewelID.set(undefined)
      };
    })

    this.nameInput$
      .pipe(debounceTime(2000))
      .subscribe(value => {
        if (value === "") {
          AlertHelper.noNamering();
          const previousName = this.editJewelService.jewel().name;
          this.editJewelService.editName(previousName);
          this.nameInput.nativeElement.value = previousName;
          this.inputWidth.set(this.adjustInputWidth(previousName));
          return;
        }
        this.editJewelService.editName(value);
      });

    // Cargamos catálogos PRIMERO
    const subscription = forkJoin({
      bases: this.baseStructureService.getBaseStructures(),
      sizes: this.sizesServices.getSizes(),
      materials: this.materialService.getMaterials(),
      gems: this.gemService.getGems(),
      settings: this.settingService.getSettings(),
      cuts: this.cutService.getCuts(),
      boxShapes: this.boxService.getBoxes(),
      innerMaterials: this.boxService.getInnerMaterials(),
      outerMaterials: this.boxService.getOuterMaterials(),
      detailMaterials: this.boxService.getDetailMaterials()

    }).subscribe((res: any) => {
      // Guardamos los catálogos en los signals para la UI (los menús)
      if (res.bases.result === "OK") this.baseStructures.set(res.bases.baseStructures);
      if (res.materials.result === "OK") this.materials.set(res.materials.materials);
      if (res.gems.result === "OK") this.gems.set(res.gems.gemstones);
      if (res.settings.result === "OK") this.settings.set(res.settings.settings);
      if (res.cuts.result === "OK") this.cuts.set(res.cuts.cuts);
      if (res.sizes.result === "OK") this.sizes.set(res.sizes.sizes);
      if (res.boxShapes.result === "OK") this.boxShapes.set(res.boxShapes.boxes)

      this.editJewelService.setCatalogs({
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

      // Decidimos la joya a mostrar
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        // Ejecutamos la función encargada de decidir qué cargar.
        this.loadWork(id);
      });
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  adjustInputWidth(value: string) {
    const width = Math.max(12, Math.min(30, value.length));
    this.inputWidth.set(width);
    return width;
  }

  onNameChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.nameInput$.next(value);
    this.adjustInputWidth(value);
  }

  private loadWork(id: string | null) {
    this.isReady.set(false);

    if (id) {
      this.editJewelService.ringSaved.set(true);
      this.jewelID.set(id);
      // Caso Edición: Cargamos de la base de datos
      this.jewelService.getJewelById(id).subscribe({
        next: (jewelRes: any) => {
          this.editJewelService.loadExistingJewel(jewelRes.jewel);
          this.isReady.set(true);
        },
        error: () => {
          this.editJewelService.setDefaultJewel();
          this.isReady.set(true);
        }
      });
    } else {
      // Caso Diseño nuevo: Miramos sessionStorage o default
      const stored = this.editJewelService.getStoredJewel();

      if (JSON.stringify(stored) === JSON.stringify(this.editJewelService.getDefaultJewel())) {
        this.jewelFromZero();
        this.isReady.set(true);
        return;
      }

      if (stored) {
        this.askToRestore(stored);
      } else {
        this.jewelFromZero();
        this.isReady.set(true);
      }
    }
  }

  getDesignPrice() {
    if (!this.fullPrice().profileName) return;
    return `${this.fullPrice().baseName}, ${this.fullPrice().variantName} con perfil ${this.fullPrice().profileName.toLowerCase()}, en ${this.fullPrice().material.toLowerCase()} de ${this.fullPrice().purity}: ${this.fullPrice().basePrice}`
  }

  getGemPrice(gem: any) {
    return `${gem.name} ${gem.origin} talla ${gem.cut} ${gem.carats}ct (${gem.quantity}u): ${this.toLocalePrice(gem.price)}`
  }

  getSettingPrice(setting: any) {
    return `${setting.name} (${setting.quantity}u): ${this.toLocalePrice(setting.price)}`
  }

  canHaveGems(): boolean {
    if (!this.editJewelService.getVariant()) return false;

    if (this.editJewelService.getVariant()!.settingsInfo.length > 0) { return true; }

    return false;
  }

  // Cambiado para devolver una promise rea
  saveRing(): Promise<void> {
    if(!this.isUserAuthenticated()) return Promise.resolve(undefined);
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const additionalTime = Math.floor((now - this.editStartTime) / 1000);

      const screenshot = this.engineComponent.getScreenshot();
      const jewel = { ...this.editJewelService.getJewelForSaving(), snapshot: screenshot, additionalTime: additionalTime  };

      const currentId = this.jewelID();
      const isNew = !currentId;

      const request$ = this.jewelID()
        ? this.jewelService.updateRing(currentId!, jewel)
        : this.jewelService.postRing(jewel);

      request$.subscribe({
        next: (res: any) => {
          this.editStartTime = Date.now();

          this.jewelID.set(res.jewel._id);
          this.editJewelService.ringSaved.set(true);

          if (this.menuOpen()) {
            AlertHelper.ringSaved()
          }

          if (isNew) {
            // this.router.navigate(['/editor3d', res.jewel._id], { replaceUrl: true });
            this.location.go(`/editor3d/${res.jewel._id}`); 
          }
          resolve();
        },
        error: (err) => {
           this.editJewelService.ringSaved.set(false);
          reject(err);
        }
      });
    });
  }

  swapEngine(engine: boolean) {
    this.engineSelector.set(engine);
    localStorage.setItem('isWebGL', engine.toString());
    this.editJewelService.resetModelUUIDs();
  }

  getSelectedeEngine() {
    return this.engineSelector();
  }

  toggleAutoRotation(status: boolean) {
    this.autoRotation.set(status);
    localStorage.setItem('autoRotation', status.toString());
  }

  toggleControls() {
    this.showControls = !this.showControls;
  }

  toggleExpand() {
    this.expandedView.set(!this.expandedView());
  }

  toggleFinal() {
    if(this.finalView())
      this.endFinishAnimation();
    else
      this.startFinishAnimation();
    this.finalView.set(!this.finalView());
  }

  toggleShare() {

    // Comprobamos que el usuario esta autenticado
    if(!this.isUserAuthenticated()) return;

    // Si esta autenticado, pero no ha guardado su diseno, se le indica que debe hacerlo
    if (! this.editJewelService.ringSaved()) {
      AlertHelper.saveRing().then((result) => {
        // Si no pulsa que si, no puede continuar
        if (!result.isConfirmed) return;
        // Si elige guardarlo al momento puede continuar
        this.saveRing().then(() => {
          this.shareOpen.set(!this.shareOpen());
        });
      })

    } else {
      this.shareOpen.set(!this.shareOpen());
    }

  }

  toggleSidebar() {
    this.menuOpen.set(!this.menuOpen());
  }

  returnToMainMenu() {
    AlertHelper.returnToMainMenu().then(res => {
      if (res.isConfirmed) {
        this.saveRing();
        this.router.navigate(['/']);
      }
      if (res.isDenied) {
        this.router.navigate(['/']);
      }
    });
  }

  onTransitionStart(event: TransitionEvent) {
    if (event.target !== this.sidebar.nativeElement) return;

    this.sidebar.nativeElement.style.whiteSpace = 'nowrap';
    this.resizeInterval = window.setInterval(() => {
      window.dispatchEvent(new Event('resize'));
    }, 16);
  }

  onTransitionEnd(event: TransitionEvent) {
    if (event.target !== this.sidebar.nativeElement) return;

    clearInterval(this.resizeInterval);
    this.sidebar.nativeElement.style.whiteSpace = this.expandedView() ? 'nowrap' : 'wrap';
  }

  // --- AUXILIARES ---

  private askToRestore(stored: NewJewel) {
    AlertHelper.askToRestore().then(result => {
      if (result.isConfirmed) {
        this.editJewelService.loadExistingJewel(stored);
        this.isReady.set(true);

      } else {
        this.jewelFromZero();
      }

    });
  }

  public jewelFromZero() {
    this.jewelID.set(undefined);
    this.editJewelService.ringSaved.set(false);
    // Limpiamos los servicios y ponemos valores por defecto
    this.editJewelService.clearStoredJewel();
    this.editJewelService.setDefaultJewel();

    // Forzamos el reset del signal isReady para que el motor 3D se entere
    this.isReady.set(false);

    // Actualizamr la URL sin recargar el componente
    this.router.navigate(['/editor3d'], { replaceUrl: true });

    // Volvemos a activar el motor
    setTimeout(() => {
      this.isReady.set(true);
    }, 100);
  }

  newRing() {
    this.editJewelService.clearStoredJewel();
    this.editJewelService.resetJewel();
    this.isReady.set(true);
    this.editJewelService.setDefaultJewel();
  }

  buyRing() {
    if(!this.isUserAuthenticated()) return;
    
    if (! this.editJewelService.ringSaved()) {
      AlertHelper.saveRing().then((result) => {
        // Si no pulsa que si, no puede continuar
        if (!result.isConfirmed) return;
        // Si elige guardarlo al momento puede continuar
        this.saveRing().then(() => {
          this.orderService.postOrder(this.jewelID()!).subscribe();

          AlertHelper.buyRing().then(res => {
            if (res.isDenied) {
              this.endFinishAnimation();
              this.router.navigate(['/']);
            }
          })
        });
      })
    } else {
      this.orderService.postOrder(this.jewelID()!).subscribe();

      AlertHelper.buyRing().then(res => {
        if (res.isDenied) {
          this.endFinishAnimation();
          this.router.navigate(['/']);
        }
      })
    }

  }

  modifyCopy() {
    if(!this.isUserAuthenticated()) return;

    const screenshot = this.engineComponent.getScreenshot();
    const jewel = {
      ...this.editJewelService.getJewelForSaving(),
      snapshot: screenshot
    };

    jewel.name += " copia";

    this.jewelService.postRing(jewel).subscribe((res: any) => {
      AlertHelper.saveAs().then(result => {
        if (result.isConfirmed) { 
          
          setTimeout(() => {
            this.finalView.set(false);
            this.menuOpen.set(false);
            this.expandedView.set(false);
          }, 250);

          this.router.navigate([`/editor3d/${res.jewel._id}`]);
          this.endFinishAnimation();
        } else {
          this.jewelID.set(res.jewel._id);
          this.editJewelService.ringSaved.set(false);
        }
      })
      
    });
  }
  //Guardarle diseño al usuario en sesion
  goToAuth(path: string) {
    // Obtenemos el estado actual del diseño
    const currentJewel = this.editJewelService.getJewelForSaving();

    // Lo guardamos manualmente en sessionStorage para asegurar que persista
    sessionStorage.setItem('editor_jewel', JSON.stringify(currentJewel));

    this.router.navigate([path]);
  }

  showNewRingWarning() {
    // Si no ha guardado el diseño antes de crear uno nuevo, avisarle
    if(!this.editJewelService.ringSaved()){
      AlertHelper.warningNewRing().then(result => {
        if(result.isConfirmed){ // Si quiere guardar y crear
            if(!this.isUserAuthenticated()) return;
            this.saveRing().then(() => {
              this.jewelFromZero();
              AlertHelper.successfullySaved();
            });
        }else if(result.isDenied){  // Si quiere descartar y crear
          this.jewelFromZero();
        }
        // Si cancela no pasa nada
      });
    }else { // Si si que lo ha guardado
      this.jewelFromZero();
    }
  }

  // Reutilizar lógica de warning y redirección al login
  private isUserAuthenticated(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Si no está autenticado guardamos por si acaso la jewel en el ss
    const currentJewel = this.editJewelService.getJewelForSaving();
    sessionStorage.setItem('editor_jewel', JSON.stringify(currentJewel));
    
    AlertHelper.restrictionAlert().then((result) => {
      if (result.isConfirmed) {
        this.endFinishAnimation();
        this.router.navigate(['/inicio-sesion']);
      }
    });

    return false; // Retornamos false para detener al padre
  }

  // ---- Animaciones -------
   startFinishAnimation() {
    this.engineComponent.playSceneAnimation();
   }
   endFinishAnimation() {
    this.engineComponent.stopSceneAnimation();
   }
}