/**
 * @file footer.component.ts
 * @brief Componente del pie de página de la aplicación.
 *
 * @details
 * Contiene elementos del footer y un estado de autenticación simplificado
 * que indica si el usuario está logueado.
 */
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTiktok, faWordpress } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from "../../services/auth.service";
import { CookieConsentService } from "../../services/cookie-consent.service";

@Component({
  selector: "app-footer",
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTiktok = faTiktok;
  faWordPress = faWordpress
  
  authService = inject(AuthService);
  cookieConsentService = inject(CookieConsentService);

  openCookies() {
    this.cookieConsentService.openBanner();
  }
}
