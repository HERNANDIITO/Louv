/**
 * @file header.component.ts
 * @brief Componente del encabezado de la aplicación.
 *
 * @details
 * Gestiona la visualización de enlaces de navegación, el estado de autenticación
 * y la apertura del overlay de perfil de usuario.
 */
import { Component, HostListener, inject, NgZone, signal } from "@angular/core";
import { NavigationEnd, RouterLink, RouterLinkActive } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { UserProfileDropwdownComponent } from "../user-profile-dropwdown/user-profile-dropwdown.component";
import { UserCartDropdownComponent } from "../user-cart-dropdown/user-cart-dropdown.component";
import { filter } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  imports: [RouterLink, UserProfileDropwdownComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  authService = inject(AuthService);
  private ngZone = inject(NgZone); // Inyectamos NgZone
  private router = inject(Router);

  isLandingPage = signal(true);
  isScrolled = signal(false);
  private scrollListener?: () => void;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL es '/' o vacía, es la landing
      this.isLandingPage.set(event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home');
    });
  }

  ngOnInit() {
    // Ejecutamos el listener fuera de Angular para que no dispare
    // la detección de cambios global en cada píxel de scroll
    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        const scrolled = window.scrollY > 10;

        // Solo volvemos a entrar en la zona de Angular si el valor REALMENTE cambia
        if (this.isScrolled() !== scrolled) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolled);
          });
        }
      };
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  isEditor3d(): boolean {
    return (this.router.url.includes('/editor3d') && !this.router.url.includes('/editor3d-old'));
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  isAdminSection(): boolean {
    return (this.router.url.includes('admin'));
  }
}