import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnInit, Renderer2 } from "@angular/core";
import { InitialSectionComponent } from "./initial-section/initial-section.component";
import { InitialVideoComponent } from "./initial-video/initial-video.component";
import { SliderSectionComponent } from "./slider-section/slider-section.component.component";
import { ShowcaseSectionComponent } from "./showcase-section/showcase-section.component";
import { InitialExplanationComponent } from "./initial-explanation/initial-explanation.component";
import { BottomBannerComponent } from "./bottom-banner/bottom-banner";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { EditJewelService } from "../../services/editorServices/editJewel.service";
import { BaseStructure, BaseStructureProfile } from "../../interfaces/baseStructure.interface";
import { Cut } from "../../interfaces/cut.interface";
import { ClawNumber, ClawType, Setting } from "../../interfaces/setting.interface";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    InitialSectionComponent,
    InitialVideoComponent,
    SliderSectionComponent,
    ShowcaseSectionComponent,
    InitialExplanationComponent,
    BottomBannerComponent,
],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  private renderer = inject(Renderer2);
  private authService = inject(AuthService);
  private router = inject(Router);
  private editJewelService = inject(EditJewelService);

  private preloaded = false;

  private queue: string[] = [];
  private loaded: string[] =[];
  private active = 0;
  private MAX = 6;

  constructor() {
    this.editJewelService.ensureCatalogs();

    effect(() => {
      if (this.preloaded) return;

      const ready = this.editJewelService.catalogsLoaded();
      if (ready) {
        this.preload();
        this.preloaded = true;
      }
    });
  }

  ngOnInit(): void {
    this.addJsonLd();
  }

  private cleanUrl() {
    window.history.replaceState({}, '', window.location.pathname);
  }

  async preload() {
    if (this.preloaded) return;

    const catalogs = this.editJewelService.getCatalog();

    catalogs.bases.forEach((base: BaseStructure) => {
      base.profiles.forEach((profile: BaseStructureProfile) => {
        if (profile.model) {
          const name = profile.model.split(".")[0];
          this.loadModel(`bases/${name}.gltf`)
          this.loadModel(`bases/${name}.json`)
          this.loadModel(`bases/${name}.bin`)
        }
      })
    })

    catalogs.cuts.forEach((cut: Cut) => {
      const name = cut.model.split(".")[0];
      this.loadModel(`gemas/${name}.gltf`)
      this.loadModel(`gemas/${name}.json`)
      this.loadModel(`gemas/${name}.bin`)
    })

    catalogs.settings.forEach((setting: Setting) => {
      setting.clawNumber?.forEach((clawNum: ClawNumber) => {
        clawNum.compatibleCuts?.forEach(compat => {
          compat.clawType?.forEach((clawType: ClawType) => {
          const name = clawType.model.split(".")[0];
          this.loadModel(`engastes/${name}.gltf`)
          this.loadModel(`engastes/${name}.json`)
          this.loadModel(`engastes/${name}.bin`)
          })
        })
      })
    })

    this.preloaded = true;

  }

  async loadModel(model: string) {
    if (this.loaded.includes(model)) return;
    if (this.queue.includes(model)) return;

    this.queue.push(model);
    this.processQueue();
  }

  private processQueue() {
    if (this.active >= this.MAX || this.queue.length === 0) return;
    
    const model = this.queue.shift()!;
    this.active++;

    fetch(`models/${model}`, { cache: 'force-cache' })
      .finally(() => {
        this.active--;
        this.processQueue();
      });
  }

  addJsonLd(): void {
    const jsonLd = {
      "@context": "http://schema.org/",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://louv.ovh/#webapp",
          "name": "Louv",
          "url": "https://louv.ovh/",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "url": "https://louv.ovh/",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "operatingSystem": "All",
          "browserRequirements": ["HTML5", "WEBGL", "ThreeJS", "JavaScript"],
          "softwareVersion": "Beta",
          "audience": {
            "@type": "Audience",
            "audienceType": "propietarios de joyas",
            "geographicArea": {
              "@type": "AdministrativeArea",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ES"
              }
            }
          },
          "copyrightHolder": {
            "@type": "Organization",
            "@id": "https://louv.ovh/patataTeam#organization/"
          },
          "countryOfOrigin": {
            "@type": "Country",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "ES"
            }
          },
          "dateCreated": "2025-09-08",
          "inLanguage": [
            {
              "@type": "Language",
              "name": "Español",
              "alternateName": "es"
            },
            {
              "@type": "Language",
              "name": "English",
              "alternateName": "en"
            }
          ],
          "interactivityType": "active",
          "isAccessibleForFree": "True",
          "keywords": [
            "ring",
            "3d",
            "threejs",
            "webgl",
            "luxury",
            "custom",
            "ua"
          ],
          "translator": {
            "@type": "Organization",
            "@id": "https://louv.ovh/patataTeam#organization/"
          }
        }
      ]
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);

    // Añadir el script al head
    const head = document.getElementsByTagName('head')[0];
    this.renderer.appendChild(head, script);
  }
}
