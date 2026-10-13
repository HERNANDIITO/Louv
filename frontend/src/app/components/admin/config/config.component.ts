import { Component, inject, signal } from "@angular/core";
import { StatsSidebarComponent } from "../stats-sidebar/stats-sidebar.component";
import { CustomInputComponent } from "../../../shared/custom-input/custom-input.component";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faArrowRightFromBracket,
  faKey,
  faQrcode,
  faShield,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { AuthService } from "../../../services/auth.service";

const passwordFormatValidator = (control: AbstractControl) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&=?¡¿\-_@+\*\[\]<>/]).+$/;
  return !control.value || regex.test(control.value)
    ? null
    : { invalidFormat: true };
};

@Component({
  selector: "app-config",
  imports: [
    StatsSidebarComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: "./config.component.html",
  styleUrl: "./config.component.scss",
})
export class ConfigComponent {
  fb = inject(FormBuilder);
  faKey = faKey;
  faQrcode = faQrcode;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faTriangleExclamation = faTriangleExclamation;
  faShield = faShield;
  authService = inject(AuthService);
  submittedPassword = signal(false);

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, passwordFormatValidator]],
      confirmNewPassword: ["", Validators.required],
    },
    {
      validators: (group: AbstractControl) => {
        const { newPassword, confirmNewPassword } = group.value;
        return newPassword === confirmNewPassword
          ? null
          : { passwordsMismatch: true };
      },
    },
  );

  isPasswordInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submittedPassword());
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError("required")) return "Este campo es obligatorio";
    if (control.hasError("invalidFormat")) return "La contraseña debe tener como mínimo una mayúscula, una minúscula, un número y uno de los símbolos ! # $ % & = ? ¡ ¿ - _ @ ; + * / [ ] < >";
    return "Campo inválido";
  }

  ngOnInit() {
    this.authService.fetchMe().subscribe({});
  }

  onChangePassword() {
    this.submittedPassword.set(true);

    if (this.passwordForm.invalid) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Revisa los errores en el formulario",
      });
      return;
    }

    this.authService.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => {
        Swal.fire("Éxito", "Contraseña cambiada correctamente", "success");
        this.passwordForm.reset();
        this.submittedPassword.set(false);
      },
      error: (err) =>
        Swal.fire(
          "Error",
          err.error?.message || "Error al cambiar la contraseña",
          "error",
        ),
    });
  }

  openTOTPModal() {
    this.authService.TOTPsetup().subscribe({
      next: (response: any) => {
        const qr = response.qrCodeDataUrl.qrCodeDataUrl;

        Swal.fire({
          title: "Configurar TOTP",
          html: `
              <p class="text-primary">
                  Descárgate la app de Authenticator y escanea el siguiente QR.
                  A continuación introduce el código de 6 dígitos.
              </p>
              <img
                  src="${qr}"
                  alt="QR TOTP"
                  style="width:200px;height:200px;margin:0 auto;display:block;"
              />
              `,
          input: "text",
          inputAttributes: {
            maxlength: "6",
            inputmode: "numeric",
            autocapitalize: "off",
            autocorrect: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Verificar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
          focusConfirm: false,

          preConfirm: (totpCode) => {
            if (!totpCode || totpCode.length !== 6) {
              Swal.showValidationMessage("Introduce un código de 6 dígitos");
              return false;
            }

            return this.authService
              .confirmTOTP({ totpCode })
              .toPromise()
              .catch(() => {
                Swal.showValidationMessage("Código inválido");
              });
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "TOTP configurado correctamente",
            });
          }
        });
      },

      error: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo generar el QR de TOTP",
        });
      },
    });
  }
}
