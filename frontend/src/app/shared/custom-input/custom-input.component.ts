/**
 * @file custom-input.component.ts
 * @brief Componente de entrada de datos personalizado.
 *
 * @details
 * Componente reutilizable para inputs con soporte de signals y validación reactiva.
 * Permite mostrar inputs de distintos tipos, con labels, placeholders, control de errores
 * y visibilidad de contraseñas.
 */
import { Component, signal, input } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-custom-input",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: "./custom-input.component.html",
  styleUrl: "./custom-input.component.scss",
})
export class CustomInputComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  // Inputs con signals
  type = input<string>("text");
  placeholder = input<string>("");
  label = input<string>("");
  id = input.required<string>();
  required = input<boolean>(false);
  layout = input<"row" | "column">("column");
  control = input.required<FormControl>();
  showErrors = input<boolean>(true);

  // Signals internas
  value = signal<any>("");
  passwordVisibility = signal<boolean>(false);

  /**
   * Devuelve el ID actual del input
   * @returns Identificador del input
   */
  get actualId(): string {
    return this.id();
  }

  /** Cambia la visibilidad de la contraseña */
  switchVisibility() {
    this.passwordVisibility.set(!this.passwordVisibility());
  }

  /**
   * Indica si el input tiene error y ha sido tocado
   * @returns true si el input es inválido y ha sido tocado
   */
  get hasErrorAndTouched(): boolean {
    if (!this.showErrors()) return false;
    const formControl = this.control();
    return (
      formControl.touched &&
      formControl.invalid &&
      formControl.hasError("required")
    );
  }
}
