/**
 * @file profile-nav.component.ts
 * @brief Componente de navegación del perfil de usuario.
 *
 * @details
 * Permite navegar entre diferentes secciones del perfil del usuario,
 * como "Mis anillos", "Mis pedidos" y "Mis datos". Gestiona el estado
 * de la pestaña activa y emite eventos al cambiar de sección.
 */
import { Component, inject, output, signal } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faGem } from "@fortawesome/free-regular-svg-icons";
import { faGear, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-profile-nav",
  imports: [FaIconComponent],
  templateUrl: "./profile-nav.component.html",
  styleUrl: "./profile-nav.component.scss",
})
export class ProfileNavComponent {
    menu = ["Mis anillos", "Mis pedidos", "Mis datos"];
    active = signal<string>("Mis anillos");
    changeActive = output<string>();
    authService = inject(AuthService)

    icons = {
        faGem,
        faShoppingCart,
        faGear
      }
    
    
    public userName = this.authService.name;
    public userSurname = this.authService.surname;
    /**
    * Cambia la sección activa del perfil y emite el cambio.
    * @param name Nombre de la sección a activar
    */
    changeView(name: string) {
        this.active.set(name);
        this.changeActive.emit(name);
    }
}
