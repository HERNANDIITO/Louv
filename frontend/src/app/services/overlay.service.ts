/**
 * @file ui-overlay.service.ts
 * @brief Servicio para gestionar overlays de interfaz de usuario.
 *
 * @details
 * Proporciona métodos para abrir y cerrar overlays globales, como el overlay
 * del perfil de usuario. Utiliza Angular CDK Overlay para crear componentes
 * flotantes sobre la aplicación.
 */
import { Injectable, inject } from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";

import { ProfileOverlayComponent } from "../shared/profile-overlay/profile-overlay.component";

@Injectable({ providedIn: "root" })
export class UiOverlayService {
    private overlay = inject(Overlay);
    private overlayRef?: OverlayRef;

    /**
    * Abre el overlay del perfil de usuario.
    *
    * - No crea un overlay si ya existe uno abierto.
    * - Centra el overlay horizontal y verticalmente.
    * - Se suscribe al evento "close" del componente para cerrarlo.
    */
    openProfile() {
        // Si ya está abierto, no duplicar
        if (this.overlayRef) return;

        // Crear overlay global
        this.overlayRef = this.overlay.create({
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.block(),
        positionStrategy: this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically(),
        panelClass: "perfil-overlay-panel",
        });

        const portal = new ComponentPortal(ProfileOverlayComponent);
        const componentRef = this.overlayRef.attach(portal);

        // Suscribirse al evento cerrar
        componentRef.instance.close.subscribe(() => this.closeProfile());
    }
    /**
    * Cierra el overlay del perfil si está abierto.
    *
    * - Libera la referencia al overlay.
    */
    closeProfile() {
        this.overlayRef?.dispose();
        this.overlayRef = undefined;
    }
}
