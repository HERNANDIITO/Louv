/**
 * @file login.component.ts
 * @brief Componente encargado del inicio de sesión de usuarios.
 *
 * @details
 * Gestiona el formulario de login, validaciones, envío de credenciales al backend
 * y recuperación de contraseña mediante modales.
 */

import { Component, inject, signal } from "@angular/core";
import { Validators, ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";

import Swal from "sweetalert2";

import { CustomInputComponent } from "../../shared/custom-input/custom-input.component";
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { AuthService } from "../../services/auth.service";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { TrackingService } from "../../services/tracking.service";

@Component({
  selector: "app-login",
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    LoadingSpinnerComponent,
    FaIconComponent
],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
    authService = inject(AuthService);
    router = inject(Router);
    private fb = inject(FormBuilder);
    private trackingService = inject(TrackingService);
    isLoading = signal(false);

    icons = {
        faChevronRight
    }

    /**
     * Formulario reactivo de inicio de sesión.
     *
     * Contiene:
     * - Email obligatorio y válido.
     * - Contraseña obligatoria.
     * - Opción "Recordarme".
     */
    loginForm = this.fb.nonNullable.group({
        email: [
        "",
        {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        },
        ],
        password: ["", { nonNullable: true, validators: [Validators.required] }],
        rememberMe: [false],
    });

    /**
     * Envía el formulario de login.
     * - Valida los campos.
     * - Llama a `AuthService.login()`.
     * - Si se requiere TOTP, muestra un modal para verificarlo.
     * - Guarda el token y redirige al editor 3D si es correcto.
     * - Muestra errores en modales si falla.
     */
    onSubmit() {
        this.isLoading.set(true);
        let accountId = "";

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            this.isLoading.set(false);
            return;
        }
        
        //Hacemos la peticion al servicio
        this.authService.login(this.loginForm.getRawValue()).subscribe({
            next: (data:any) => { 
                // si es un admin con totp activado
                if(data.result === "TOTP_REQUIRED"){ 
                    accountId = data.accountId;

                    Swal.fire({
                        title: "Introduce el código TOTP",
                        input: "text",
                        inputLabel: "Código de 6 dígitos",
                        inputPlaceholder: "123456",
                        showCancelButton: true,
                        confirmButtonText: "Verificar",
                        cancelButtonText: "Cancelar",
                        reverseButtons: true,
                        preConfirm: async (totpCode) => {
                            if (!totpCode) {
                                Swal.showValidationMessage("Debes introducir el código TOTP");
                                return false;
                            }
                            const email = this.loginForm.get('email')!.value;
                            try {
                                await firstValueFrom(this.authService.verifyTOTP({ email, totpCode }));
                                await firstValueFrom(this.authService.fetchMe());
                                
                                return true;
                            } catch (error:any) {
                                Swal.showValidationMessage(
                                    error.error?.message || "Código inválido"
                                );
                                return false;
                            }
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.navigate(['/editor3d']); 
                        } 
                        this.isLoading.set(false);
                    });
                }else{
                    //usuarios sin topt 
                    this.authService.fetchMe().subscribe((user: any) => {
                        // comprobar que no es admin por si acaso
                        if (!this.authService.isAdmin()) {
                            if (user?._id) {
                                localStorage.setItem('userId', user._id);
                            }
                            this.trackingService.postEvent('login');
                        }
                        const location = this.authService.isAdmin() ? "/estadisticas-admin" : "/editor3d";
                        this.router.navigate([location]);
                        this.isLoading.set(false);
                    });
                    
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                //Modal del error
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.error?.message || 'Error inesperado',
                    confirmButtonText: "Aceptar"
                });
            }
        });
    }

    /**
   * Muestra un modal indicando que se ha enviado un enlace
   * de recuperación de contraseña al email proporcionado.
   *
   * @param email Email del usuario que solicitó la recuperación.
   */
    sendEmail(email: string) {
        Swal.fire({
        icon: "success",
        title: "¡Revise su correo!",
        text: `Se ha enviado un enlace de recuperación a ${email}.`,
        confirmButtonText: "Aceptar"
        });
    }

    oauth(): void {
        window.location.href = `${environment.apiUrl}/auth/google?consent=false`;
    }
}
