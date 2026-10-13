import { Component, inject, signal, OnInit, effect } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CustomInputComponent } from "../../custom-input/custom-input.component";
import { AuthService } from "../../../services/auth.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const passwordFormatValidator = (control: AbstractControl) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&=?¡¿\-_@+\*\[\]<>/]).+$/;
  return !control.value || regex.test(control.value)
    ? null
    : { invalidFormat: true };
};

const spanishPhoneValidator = (control: AbstractControl) => {
  if (!control.value) return null;
  const cleanValue = control.value.toString().replace(/[\s-]/g, "");
  const regex = /^(\+34)?[6789]\d{8}$/;

  return regex.test(cleanValue) ? null : { invalidPhone: true };
};

const spanishPostalCodeValidator = (control: AbstractControl) => {
  if (!control.value) return null;
  const cleanValue = control.value.toString().replace(/\s/g, "");
  const regex = /^(0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/;
  return regex.test(cleanValue) ? null : { invalidPostalCode: true };
};

@Component({
  selector: "app-my-data",
  standalone: true,
  imports: [CustomInputComponent, ReactiveFormsModule, FaIconComponent],
  templateUrl: "./my-data.component.html",
  styleUrl: "./my-data.component.scss",
})
export class MyDataComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  faTrash = faTrash;
  faFloppyDisk = faFloppyDisk;

  readonly SPAIN_PROVINCES = [
    "Álava",
    "Albacete",
    "Alicante",
    "Almería",
    "Asturias",
    "Ávila",
    "Badajoz",
    "Barcelona",
    "Burgos",
    "Cáceres",
    "Cádiz",
    "Cantabria",
    "Castellón",
    "Ceuta",
    "Ciudad Real",
    "Córdoba",
    "Cuenca",
    "Gerona",
    "Granada",
    "Guadalajara",
    "Guipúzcoa",
    "Huelva",
    "Huesca",
    "Islas Baleares",
    "Jaén",
    "La Coruña",
    "La Rioja",
    "Las Palmas",
    "León",
    "Lérida",
    "Lugo",
    "Madrid",
    "Málaga",
    "Melilla",
    "Murcia",
    "Navarra",
    "Orense",
    "Palencia",
    "Pontevedra",
    "Salamanca",
    "Santa Cruz de Tenerife",
    "Segovia",
    "Sevilla",
    "Soria",
    "Tarragona",
    "Teruel",
    "Toledo",
    "Valencia",
    "Valladolid",
    "Vizcaya",
    "Zamora",
    "Zaragoza",
  ];
  readonly COUNTRIES = [{ label: "España", value: "spain" }];
  readonly TITLES = [
    { label: "Sr.", value: "Mr." },
    { label: "Sra.", value: "Ms." },
    { label: "Prefiero no decirlo", value: null },
  ];

  showAddress = signal(false);
  hasPhone = signal(false);
  submitted = signal(false);
  submittedPassword = signal(false);

  userData = this.fb.nonNullable.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    surname: [""],
    title: [null as string | null],
    dni: [""],
    number: ["", spanishPhoneValidator],

    address: this.fb.group({
      street: [""],
      extraInfo: [""],
      postalCode: ["", spanishPostalCodeValidator],
      locality: [""],
      country: this.fb.control<string | null>(null),
      province: this.fb.control<string | null>(null),
    }),
  });

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

  constructor() {
    effect(() => {
      const addrGroup = this.userData.controls.address;
      const fields = [
        "street",
        "postalCode",
        "locality",
        "province",
        "country",
      ];

      if (this.showAddress()) {
        fields.forEach((f) => {
          fields.forEach((f) => {
            const ctrl = addrGroup.get(f);
            const validators =
              f === "postalCode"
                ? [Validators.required, spanishPostalCodeValidator]
                : [Validators.required];
            ctrl?.setValidators(validators);
            ctrl?.updateValueAndValidity({ emitEvent: false });
          });
        });
      } else {
        addrGroup.reset();
        fields.forEach((f) => {
          const ctrl = addrGroup.get(f);
          ctrl?.clearValidators();
          ctrl?.updateValueAndValidity({ emitEvent: false });
        });
      }
      addrGroup.updateValueAndValidity();
      this.userData.updateValueAndValidity();
    });
  }

  isDataInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  isPasswordInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submittedPassword());
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError("required")) return "Este campo es obligatorio";
    if (control.hasError("email")) return "Formato de email inválido";
    if (control.hasError("minlength")) return "Es demasiado corto";
    if (control.hasError("invalidPhone")) return "Formato no válido. Ejemplo: 600123456 (móvil), 912345678 (fijo) o con +34.";
    if (control.hasError("invalidPostalCode")) return "Código postal no válido (debe ser de 5 dígitos: 01000 - 52999)";
    if (control.hasError("invalidFormat")) return "La contraseña debe tener como mínimo una mayúscula, una minúscula, un número y uno de los símbolos ! # $ % & = ? ¡ ¿ - _ @ ; + * / [ ] < >";
    if (control.hasError("serverError")) return control.getError("serverError");

    return "Campo inválido";
  }

  sectionHasErrors(type: "personal" | "address"): boolean {
    if (!this.submitted()) return false;
    if (type === "personal") {
      const c = this.userData.controls;
      return c.name.invalid || c.email.invalid;
    } else {
      return this.showAddress() && this.userData.controls.address.invalid;
    }
  }

  ngOnInit() {
    const user = this.authService.user();
    if (user) {
      this.userData.patchValue({
        name: user.name,
        email: user.email,
        surname: user.surname || "",
        title: user.title || null,
        dni: user.dni || "",
        number: user.phone || "",
        address: {
          street: user.address?.street || "",
          province: user.address?.province ?? null,
          country: user.address?.country ?? null,
          locality: user.address?.locality || "",
          postalCode: user.address?.postalCode || "",
          extraInfo: user.address?.extraInfo || "",
        },
      });
      this.showAddress.set(!!user.address?.street);
      this.hasPhone.set(!!user.phone);
    }
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.userData.invalid) {
      const hasPersonalErrors = this.sectionHasErrors("personal");
      const hasAddressErrors = this.sectionHasErrors("address");

      let errorMsg = "Por favor, rellena los campos obligatorios.";

      if (hasPersonalErrors && hasAddressErrors) {
        errorMsg =
          "Revisa los datos personales y la dirección; faltan campos obligatorios en ambos.";
      } else if (hasPersonalErrors) {
        errorMsg = "Faltan campos obligatorios en tus datos personales.";
      } else if (hasAddressErrors) {
        errorMsg =
          "La dirección está incompleta. Por favor, rellena todos los campos marcados con *.";
      }

      return this.showWarning(errorMsg);
    }

    const raw = this.userData.getRawValue();

    const payload: any = {
      name: raw.name.trim(),
      email: raw.email.trim(),
      surname: raw.surname?.trim() || null,
      title: raw.title,
      dni: raw.dni?.trim() || null,
      phone: this.hasPhone() && raw.number ? raw.number.trim() : null,
      address: this.showAddress()
        ? {
            street: raw.address.street?.trim(),
            extraInfo: raw.address.extraInfo?.trim() || undefined,
            postalCode: raw.address.postalCode?.trim(),
            locality: raw.address.locality?.trim(),
            province: raw.address.province,
            country: raw.address.country,
          }
        : null,
    };

    this.authService.updateMe(payload).subscribe({
      next: () => {
        this.authService.fetchMe().subscribe();
        Swal.fire("Éxito", "Datos actualizados", "success");
        this.submitted.set(false);
      },
      error: (err) =>
        Swal.fire(
          "Error",
          err.error?.message || "No se pudo actualizar",
          "error",
        ),
    });
  }

  onChangePassword() {
    this.submittedPassword.set(true);
    if (this.passwordForm.invalid)
      return this.showWarning("Revisa los errores en el formulario");

    this.authService.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => {
        Swal.fire("Éxito", "Contraseña cambiada", "success");
        this.passwordForm.reset();
        this.submittedPassword.set(false);
      },
      error: (err) =>
        Swal.fire("Error", err.error?.message || "Error al cambiar", "error"),
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
}
