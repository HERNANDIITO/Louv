import { Component, inject, OnInit, Renderer2, signal } from "@angular/core";
import { StatsAdminService } from "../../services/stats-admin.service";
import Swal from "sweetalert2"; // 1. Importar SweetAlert

@Component({
  selector: "open-data",
  templateUrl: "./open-data.component.html",
  styleUrl: "./open-data.component.scss",
})
export class OpenDataComponent implements OnInit {
  private statsService = inject(StatsAdminService);
  private renderer = inject(Renderer2);
  public isLoading = signal(false);

  ngOnInit(): void {
    this.addJsonLd();
  }

  public downloadOpenData() {
    this.isLoading.set(true);

    this.statsService.getReportZipped().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.zip";
        a.click();
        window.URL.revokeObjectURL(url);

        this.isLoading.set(false);

        Swal.fire({
          icon: "success",
          title: "Descarga completada",
          text: "El archivo se ha descargado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: async (err) => {
        this.isLoading.set(false);
        let errorMessage = "No se pudo procesar la descarga en este momento.";

        if (err.error instanceof Blob) {
          try {
            const text = await err.error.text();
            const result = JSON.parse(text);
            errorMessage = result.message || result.error || errorMessage;
          } catch (e) {}
        }

        Swal.fire({
          icon: "error",
          title: "Error al descargar",
          text: errorMessage,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#7b2cbf",
        });
      },
    });
  }

  private addJsonLd(): void {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://louv.phg21.es/#organization",
          "name": "Patata Team",
          "url": "https://louv.phg21.es/",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "ES"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://louv.phg21.es/#website",
          "url": "https://louv.phg21.es/",
          "name": "Louv",
          "publisher": {
            "@id": "https://louv.phg21.es/#organization"
          },
          "inLanguage": [
            "es",
          ]
        },
        {
          "@type": "WebPage",
          "@id": "https://louv.phg21.es/datos-abiertos/#webpage",
          "url": "https://louv.phg21.es/datos-abiertos/",
          "name": "Open Data",
          "description": "Página de descarga de datos estadísticos y métricas internas exportables en formato CSV comprimido en ZIP.",
          "isPartOf": {
            "@id": "https://louv.phg21.es/#website"
          },
          "about": {
            "@id": "https://louv.phg21.es/datos-abiertos/#dataset"
          },
          "publisher": {
            "@id": "https://louv.phg21.es/#organization"
          },
          "inLanguage": [
            "es",
          ]
        },
        {
          "@type": "Dataset",
          "@id": "https://louv.phg21.es/datos-abiertos/#dataset",
          "url": "https://louv.phg21.es/datos-abiertos/",
          "name": "Louv Open Data",
          "description": "Colección de métricas internas y datos estadísticos exportables relacionados con tráfico, gemas, metales, engastes y tipos de bases.",
          "keywords": [
            "open data",
            "csv",
            "zip",
            "estadísticas",
            "joyería",
            "tráfico",
            "gems",
            "metales",
            "engastes",
            "analytics"
          ],
          "creator": {
            "@id": "https://louv.phg21.es/#organization"
          },
          "publisher": {
            "@id": "https://louv.phg21.es/#organization"
          },
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "isAccessibleForFree": true,
          "inLanguage": [
            "es",
          ],
          "measurementTechnique": "System generated analytics",
          "distribution": [
            {
              "@type": "DataDownload",
              "name": "Open Data ZIP Export",
              "encodingFormat": "application/zip",
              "contentUrl": "https://louv.phg21.es/datos-abiertos/"
            }
          ],
        }
      ]
    }

    const script = this.renderer.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);

    const head = document.getElementsByTagName("head")[0];
    this.renderer.appendChild(head, script);
  }
}
