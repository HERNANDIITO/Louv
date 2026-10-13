import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { EngineComponent } from "../../shared/engine/engine.component";
import { JewelService } from '../../services/jewel.service';
import { EditJewelService } from '../../services/editorServices/editJewel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from '../../helpers/alerts.helper';
import { BigSwitchComponent } from "../../shared/big-switch/big-switch.component";

@Component({
  selector: 'app-visor',
  imports: [EngineComponent, BigSwitchComponent],
  templateUrl: './visor.component.html',
  styleUrl: './visor.component.scss',
  providers: [EditJewelService]
})
export class VisorComponent implements OnInit {
  isReady = signal(false);
  jewelID = input.required<string>();
  noBG = input<boolean>(false);
  fullscreen = input<boolean>(true);
  isMyDesigns = input<boolean>(false);
  hash?: string;
  price?: string;

  engineSelector = signal<boolean>(localStorage.getItem('isWebGL') === 'true');

  private jewelService = inject(JewelService);
  public editJewelService = inject(EditJewelService); // Público para el HTML
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  error = signal<string>("");

  constructor() {

    this.editJewelService.ensureCatalogs();

    effect(() => {
      const catalogsLoaded = this.editJewelService.catalogsLoaded();

      if ( catalogsLoaded ) {
        this.reload();
      }
    })
  }

  ngOnInit(): void {
  }

  swapEngine(engine: boolean) {
    this.engineSelector.set(engine);
    localStorage.setItem('isWebGL', engine.toString());
    this.editJewelService.resetModelUUIDs();
  }

  reload() {
    if (!this.jewelID()) {

      this.route.paramMap.subscribe(params => {
        const hash = params.get('id');

        if (!hash) return;

        this.jewelService.getIDByHash(hash).subscribe({
          next: (hashRes: any) => {
            const jewel = hashRes.jewel;
            if (jewel.taxablePrice) {
              this.price = Number(jewel.taxablePrice.$numberDecimal).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              });

            }

            this.editJewelService.loadExistingJewel(jewel);
        },
        error: (hashRes: any) => {
          this.error.set(hashRes.error.message)
          AlertHelper.jewelNotFound().then((result) => {
            if (result.isConfirmed) {
               this.router.navigate(["/"]);
            }
          });
        }
      });
    })

    } else {

      this.jewelService.getJewelById(this.jewelID()).subscribe({
        next: (jewelRes: any) => {
          const jewel = jewelRes.jewel;
          this.editJewelService.loadExistingJewel(jewel);
          this.price = Number(jewel.taxablePrice.$numberDecimal).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          });
          this.isReady.set(true);
        }
      });
    }
  }
}