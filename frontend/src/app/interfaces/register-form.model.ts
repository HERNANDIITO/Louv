/**
 * @interface registerForm
 * @brief Modelo de datos para el formulario de registro de usuarios.
 *
 * @details
 * Representa la información que se recopila al registrar un nuevo usuario,
 * incluyendo datos personales, credenciales y aceptación de términos.
 */
export interface registerForm {
    name: string,
    surname:string,
    title: string,
    email: string,
    password: string,
    repassword: string,
    countryPrefix?: string,
    phone?: string,
    acceptTerms: boolean
}
