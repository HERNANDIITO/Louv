import { Component, computed, ElementRef, EventEmitter, HostListener, inject, input, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faSignOutAlt, faGear, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { UiOverlayService } from '../../services/overlay.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-profile-dropwdown',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './user-profile-dropwdown.component.html',
  styleUrl: './user-profile-dropwdown.component.scss'
})
export class UserProfileDropwdownComponent {
    faUser = faUser;
    faSignOutAlt = faSignOutAlt;
    faGear = faGear;
    faChartSimple = faChartSimple;
    
    isLanding = input<boolean>(false);

    // Servicios
    authService = inject(AuthService);
    private elementRef = inject(ElementRef);
    private overlayService = inject(UiOverlayService);
    // Signal para gestionar si el dropdown está visible
    public isDropdownOpen = signal(false);

    userName = computed(() => this.authService.name());
    public showProfile = signal(false);

    constructor() {}

    openProfile() {
        this.showProfile.set(true);
        this.isDropdownOpen.set(false);
        this.overlayService.openProfile();
    }

    // 1. Alternar la visibilidad del menú
    toggleDropdown(): void {
        this.isDropdownOpen.update(value => !value);
    }

    // 2. Método para cerrar sesión
    logout(): void {
        this.authService.logout();
        this.isDropdownOpen.set(false); // Cierra el menú después de cerrar sesión
    }

    // 3. Cierre automático al hacer clic fuera del componente
    // Esto es crucial para la UX del dropdown.
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
        // Si el clic no está dentro de este componente, ciérralo.
        if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isDropdownOpen.set(false);
        }
    }
}
