/**
 * @file app.config.ts
 * @brief Configuración principal de la aplicación Angular.
 *
 * @details
 * Define los proveedores globales y servicios esenciales para la aplicación,
 * incluyendo:
 * - Manejo global de errores del navegador
 * - Detección de cambios zoneless
 * - Configuración del router con enlace de inputs en componentes
 * - Cliente HTTP
 * - Importación de ReactiveFormsModule
 */
import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, } from "@angular/core";
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { routes } from "./app.routes";
import { AuthRefreshInterceptor } from "./interceptors/auth-refresh.interceptor";

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })),
    importProvidersFrom(ReactiveFormsModule),
    {provide: LOCALE_ID, useValue: 'es-ES'},
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRefreshInterceptor,
      multi: true
    },
  ],
};
