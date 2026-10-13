/**
 * @interface EmailCheckResponse
 * @brief Modelo de la respuesta al verificar la existencia de un email.
 *
 * @details
 * Representa la estructura que devuelve el backend al comprobar si un correo
 * electrónico ya está registrado.
 */
export interface EmailCheckResponse {
  exists: boolean;
  message?: string;
}