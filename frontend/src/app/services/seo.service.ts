import { Injectable, Inject } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";

@Injectable({ providedIn: "root" })
export class SeoService {
    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private doc: Document
    ) {}
    /**
     * Establece el título de la página, opcionalmente añadiendo
     * el nombre del sitio al final.
     *
     * @param title - Título específico de la página.
     * @param siteName - Nombre del sitio para formar el título completo.
     *
     * @example
     * seoService.setTitle('Inicio');
     * // Resultado: "Inicio | Louv"
     */
    setTitle(title: string, siteName = "Louv") {
        const full = title ? `${title} - ${siteName}` : siteName;
        this.title.setTitle(full);
    }
    /**
     * Actualiza múltiples metaetiquetas al mismo tiempo. 
     * Puede manejar etiquetas con name o con property
     *
     * @param tags - Array de objetos que representan metaetiquetas.
     */
    updateMetaTags(tags: Array<{ name?: string; property?: string; content: string }>) {
        tags.forEach((tag) => {
        if (tag.name) {
            this.meta.updateTag({ name: tag.name, content: tag.content });
        } else if (tag.property) {
            this.meta.updateTag({ property: tag.property, content: tag.content });
        }
        });
    }
    /**
     * Crea o actualiza la etiqueta canonical del documento.
     * Si no se pasa url, se usa la URL actual del navegador.
     *
     * @param url - URL que debe declararse como canonical.
     *
     */
    setCanonical(url: string) {
        let link: HTMLLinkElement | null =
            document.querySelector("link[rel='canonical']");

        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            document.head.appendChild(link);
        }

        link.setAttribute("href", url);
    }
    /**
     * Configura de manera centralizada información SEO básica:
     * - Título
     * - Descripción
     * - URL canonical
     *
     * Este método está pensado para llamadas en cambios de ruta. 
     * @param options - Opciones SEO a establecer.
     * @param options.title - Título de la página.
     * @param options.description - Meta descripción.
     * @param options.url - URL canonical.
     */
    setTitleAndMeta(options: {
        title?: string;
        description?: string;
        url?: string;
        indexable?: boolean;
    }) {

        const { title, description, url, indexable } = options;

        //Título
        if (title) {
            this.setTitle(title);

            // OG title
            this.meta.updateTag({ property: "og:title", content: title });
        }

        // Descripción
        if (description) {
            this.meta.updateTag({ name: "description", content: description });

            // OG description
            this.meta.updateTag({ property: "og:description", content: description });
        }

        // Robots
        const robotsValue = indexable === false ? "noindex, nofollow" : "index, follow";
        this.meta.updateTag({ name: "robots", content: robotsValue });

        // url 
        if (url) {
            this.setCanonical(url);
            this.meta.updateTag({ property: "og:url", content: url });
        }

    }

}