import { Component, computed, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBagShopping, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-cart-dropdown',
  imports: [CurrencyPipe, FontAwesomeModule],
  templateUrl: './user-cart-dropdown.component.html',
  styleUrl: './user-cart-dropdown.component.scss'
})
export class UserCartDropdownComponent {
    faBagShopping = faBagShopping;
    faXmark = faXmark;
    
    isLanding = input<boolean>(false);
    authService = inject(AuthService);
    private elementRef = inject(ElementRef);
    public isDropdownOpen = signal(false);
    public userName = this.authService.name;
    public showProfile = signal(false);

    isProfileOpen = signal(false);
    isCartOpen = signal(false);

    // Datos de ejemplo para el carrito (esto vendría de un servicio)
    cartItems = signal([
        { id: 1, name: 'Diseño 1', price: 980, image: 'images/placeholder.image.png' },
        { id: 2, name: 'Diseño 2', price: 980, image: 'images/placeholder.image.png' }
    ]);

    // Cálculo del total automáticamente usando computed
    totalCart = computed(() => 
        this.cartItems().reduce((acc, item) => acc + item.price, 0)
    );

    // Contador de artículos
    cartCount = computed(() => this.cartItems().length);

    constructor() {}

    toggleDropdown(): void {
        this.isDropdownOpen.update(value => !value);
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
        // Si el clic no está dentro de este componente, ciérralo.
        if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isDropdownOpen.set(false);
        }
    }

    // Control del Dropdown de Cesta
    toggleCart() {
        this.isProfileOpen.set(false); // Cierra el perfil si está abierto
        this.isCartOpen.update(val => !val);
    }

    // Acción del botón principal
    goToCheckout() {
        this.isCartOpen.set(false);
        // Aquí usarías: this.router.navigate(['/checkout']);
    }

    // Eliminar artículo (opcional)
    removeItem(id: number) {
        this.cartItems.update(items => items.filter(i => i.id !== id));
    }
}
