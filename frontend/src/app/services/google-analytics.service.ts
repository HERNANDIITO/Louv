// google-analytics.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;  // Esta declaración hace que TypeScript reconozca la función gtag

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que envía eventos de vista de página a Google Analytics 
 * cuando cambia la ruta en la aplicación.
 */
export class GoogleAnalyticsService {

  // Eliminamos el constructor con el subscribe
  constructor() {}

  // Creamos un método para llamar manualmente
  trackPage(url: string, title?: string) {
    gtag('event', 'page_view', {
      page_path: url,
      page_title: title // Pasamos el título explícitamente para asegurar que GA lo reciba bien
    });
  }
}
