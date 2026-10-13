/**
 * @file app.routes.ts
 * @brief Definición de las rutas de la aplicación Angular.
 *
 * @details
 * Configura el enrutamiento principal de la aplicación.
 */
import { Routes } from "@angular/router";

import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";

import { guestGuard } from "./guards/guest.guard";
import { NoFooterLayoutComponent } from "./layouts/no-footer-layout/no-footer-layout.component";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

/** Rutas principales de la aplicación */
export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "inicio-sesion",
        loadComponent: () =>
          import("./components/login/login.component").then(
            (m) => m.LoginComponent,
          ),
        canActivate: [guestGuard],
        data: {
          title: "Iniciar sesión",
          description:
            "Accede a tu cuenta de Louv para gestionar pedidos y diseños.",
          indexable: false,
        },
      },
      {
        path: "registro",
        loadComponent: () =>
          import("./components/register/register.component").then(
            (m) => m.RegisterComponent,
          ),
        canActivate: [guestGuard],
        data: {
          title: "Registro",
          description:
            "Crea una cuenta en Louv para empezar a diseñar y comprar joyas.",
          indexable: false,
        },
      },
      {
        path: "politica-de-privacidad",
        loadComponent: () =>
          import("./components/privacy/privacy.component").then(
            (m) => m.PrivacyComponent,
          ),
        data: {
          title: "Política de privacidad",
          description: "Política de privacidad de Louv.",
          indexable: false,
        },
      },
      {
        path: "politica-de-cookies",
        loadComponent: () =>
          import("./components/cookies/cookies.component").then(
            (m) => m.CookiesComponent,
          ),
        data: {
          title: "Política de cookies",
          description: "Política de cookies de Louv.",
          indexable: false,
        },
      },
      {
        path: "terminos-y-condiciones",
        loadComponent: () =>
          import(
            "./components/terms-conditions/terms-conditions.component"
          ).then((m) => m.TermsConditionsComponent),
        data: {
          title: "Términos y condiciones",
          description: "Términos y condiciones de Louv.",
          indexable: false,
        },
      },
      {
        path: "datos-abiertos",
        loadComponent: () =>
          import(
            "./components/open-data/open-data.component"
          ).then((m) => m.OpenDataComponent),
        data: {
          title: "Datos Abiertos",
          description: "Datos abiertos en formato CSV de Louv.",
          indexable: true,
        },
      },
      {
        path: "",
        loadComponent: () =>
          import("./components/home/home.component").then(
            (m) => m.HomeComponent,
          ),
        pathMatch: "full",
        data: {
          title: "Crea tu joya ideal: Editor 3D de Anillos Únicos",
          description:
            "Diseña el símbolo perfecto para un evento especial. Crea anillos de boda y compromiso únicos con nuestro editor 3D. Joyería personalizada para momentos inolvidables.",
          indexable: true,
        },
      },
    ],
  },
  {
    path: "",
    component: NoFooterLayoutComponent,
    children: [
      {
        path: "editor3d",
        loadComponent: () =>
          import("./components/editor/editor.component").then(
            (m) => m.EditorComponent,
          ),
        data: {
          title: "Editor 3D",
          description:
            "Diseña tu anillo en 3D en Louv con nuestro editor interactivo.",
          indexable: true,
        },
      },
      {
        path: "visor3d/:id",
        loadComponent: () =>
          import("./components/visor/visor.component").then(
            (m) => m.VisorComponent,
          ),
        data: {
          title: "Anillo compartido",
        },
      },
      {
        path: "editor3d/:id",
        loadComponent: () =>
          import("./components/editor/editor.component").then(
            (m) => m.EditorComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: "estadisticas-admin",
        loadComponent: () =>
          import("./components/admin/stats-admin/statsadmin.component").then(
            (m) => m.StatsadminComponent,
          ),
        data: {
          title: "Administración: estadísticas",
          description: "Estadísticas del sitio.",
          indexable: false,
        },
        canActivate: [adminGuard],
      },
      {
        path: "pedidos-admin",
        loadComponent: () =>
          import("./components/admin/orders-admin/ordersadmin.component").then(
            (m) => m.OrdersAdminComponent,
          ),
        data: {
          title: "Administración: pedidos",
          description: "Administración de los pedidos de usuarios.",
          indexable: false,
        },
        canActivate: [adminGuard],
      },
      {
        path: "modificadores-admin",
        loadComponent: () =>
          import(
            "./components/admin/modifiers-admin/modifiersadmin.component"
          ).then((m) => m.ModifiersadminComponent),
        data: {
          title: "Administración: modificadores",
          description: "Administración de los modificadores de anillos.",
          indexable: false,
        },
        canActivate: [adminGuard],
      },
      {
        path: "configuracion-admin",
        loadComponent: () =>
          import("./components/admin/config/config.component").then(
            (m) => m.ConfigComponent,
          ),
        data: {
          title: "Administración: configuracón",
          description: "Configuración de la cuenta del administrador.",
          indexable: false,
        },
        canActivate: [adminGuard],
      },
    ],
  },
  { path: "**", redirectTo: "" },
];
