/**
 * @file register.component.ts
 * @brief Componente que gestiona el formulario de registro de usuarios.
 *
 * @details
 * Incluye validaciones, envío de datos al backend y soporte para OAuth.
 */

import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  AsyncValidatorFn,
} from "@angular/forms";
import { NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";

import { Observable, of, switchMap, timer } from "rxjs";
import Swal from "sweetalert2";

import { CustomInputComponent } from "../../shared/custom-input/custom-input.component";
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { AuthService } from "../../services/auth.service";
import { registerForm } from "../../interfaces/register-form.model";
import { environment } from "../../../environments/environment";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { TrackingService } from '../../services/tracking.service';

/**
 * Validador que compara los campos "password" y "repassword".
 *
 * @returns {ValidatorFn} Función de validación que devuelve "null" si coinciden
 *                        o un error "{ PasswordNoMatch: true }" si no.
 */
function comparePasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password")?.value;
    const repassword = control.get("repassword")?.value;

    return password === repassword ? null : { PasswordNoMatch: true };
  };
}

/**
 * Validador asíncrono que comprueba si un email ya existe en la base de datos.
 *
 * Usa el servicio "AuthService" para realizar una petición HTTP al backend.
 *
 * @returns {AsyncValidatorFn} Función de validación que devuelve un Observable
 *                             con "null" si el email es único o un error si no lo es.
 */

export function emailIsUnique(): AsyncValidatorFn {
  const authService = inject(AuthService);

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.pristine) return of(null);
    return timer(500).pipe(
      switchMap(() => authService.checkUniqueEmail(control.value)),
    );
  };
}

const spanishPhoneValidator = (control: AbstractControl) => {
  if (!control.value) return null;
  const cleanValue = control.value.toString().replace(/[\s-]/g, "");
  const regex = /^(\+34)?[6789]\d{8}$/;
  return regex.test(cleanValue) ? null : { invalidPhone: true };
};

/**
 * @class RegisterComponent
 * @brief Componente encargado del formulario de registro de usuarios.
 *
 * Este componente gestiona:
 * - La creación del formulario reactivo de registro.
 * - Validaciones síncronas y asíncronas (email único, coincidencia de contraseñas).
 * - Envío del formulario al backend mediante AuthService.
 * - Gestión de estados de carga y despliegue de alertas con SweetAlert2.
 */
@Component({
  selector: "app-register",
  imports: [
    CustomInputComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    FaIconComponent,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private trackingService = inject(TrackingService);
  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal(false);
  submitted = signal(false);

  icons = { faChevronRight };

  registerForm = this.fb.nonNullable.group(
    {
      name: ["", [Validators.required]],
      surname: ["", [Validators.required]],
      title: ["Mr."],
      email: ["", [Validators.required, Validators.email], [emailIsUnique()]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&=\?¡¿\-\_\@;\+\*\/\[\]<>.,]).{8,}$/,
          ),
        ],
      ],
      repassword: ["", [Validators.required]],
      phone: ["", [spanishPhoneValidator]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    { validators: comparePasswordValidator() },
  );

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  onSubmit() {
    this.submitted.set(true);
    
    if (this.registerForm.pending) return;

    if (this.registerForm.invalid) {
      const controls = this.registerForm.controls;

      const hasRequiredErrors =
        controls.name.hasError("required") ||
        controls.surname.hasError("required") ||
        controls.email.hasError("required") ||
        controls.password.hasError("required") ||
        controls.repassword.hasError("required") ||
        controls.acceptTerms.invalid;

      const hasFormatErrors =
        controls.email.hasError("email") ||
        controls.email.hasError("emailNotUnique") ||
        controls.password.hasError("pattern") ||
        controls.password.hasError("minlength") ||
        controls.phone.invalid ||
        this.registerForm.hasError("PasswordNoMatch");

      let errorMsg = "Por favor, revisa el formulario.";

      if (hasRequiredErrors && hasFormatErrors) {
        errorMsg =
          "Faltan campos obligatorios (*) y algunos datos no tienen el formato correcto.";
      } else if (hasRequiredErrors) {
        errorMsg =
          "Por favor, rellena todos los campos obligatorios (marcados con *).";
      } else if (hasFormatErrors) {
        errorMsg =
          "Algunos campos no cumplen el formato requerido o las contraseñas no coinciden.";
      }

      return this.showWarning(errorMsg);
    }

    this.isLoading.set(true);

    this.authService.signUp(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
       // Guardar el evento de registro en la bd
        this.trackingService.postEvent('signup');
        
        this.registerForm.disable();

        Swal.fire({
          title: "¡Registro completado!",
          text: "Cuenta creada satisfactoriamente.",
          icon: "success",
          confirmButtonText: "Ir al inicio de sesión",
          allowOutsideClick: false,
        }).then(() => this.router.navigate(["/inicio-sesion"]));
      },
      error: (err) => {
        this.isLoading.set(false);
        Swal.fire(
          "Error",
          err.error?.message || "Error en el registro",
          "error",
        );
      },
    });
  }

  private showWarning(text: string) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text,
      confirmButtonText: "Aceptar",
    });
  }

  oauth(): void {
    window.location.href = `${environment.apiUrl}/auth/google?consent=true`;
  }
}
