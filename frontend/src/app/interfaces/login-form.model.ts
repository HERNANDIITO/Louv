/**
 * @interface loginForm
 * @brief Modelo de datos para el formulario de inicio de sesión.
 *
 * @details
 * Representa la información que un usuario ingresa para autenticarse,
 * incluyendo email, contraseña y opción de "Recordarme".
 */
export interface loginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}
