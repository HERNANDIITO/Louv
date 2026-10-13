import Swal from "sweetalert2";

export class AlertHelper {

    static ringSaved() {
        return Swal.fire({
            icon: "success",
            title: "¡Anillo guardado con éxito!",
        })
    }

    static saveAs() {
        return Swal.fire({
            title: "Duplicar diseño",
            icon: "success",
            text: "Anillo copiado con éxito, ¿deseas editar el nuevo diseño?",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
        })
    }

    static jewelNotFound() {
        return Swal.fire({
            icon: "error",
            title: "Joya no encontrada.",
            text: "Parece que el enlace ha cambiado. Solicita al dueño del diseño que te lo reenvíe.",
            confirmButtonText: "Aceptar",
        })
    }

    static noNamering() {
        return Swal.fire({
            icon: "error",
            title: "¡Todo diseño merece tener su nombre!",
            text: "No puedes dejar que tu diseño pierda su identidad. ",
            confirmButtonText: "Continuar",
        })
    }

    static buyRing() {
        return Swal.fire({
            title: "Muchas gracias por su confianza",
            text: "Nos emociona de que haya depositado su confianza en Louv, pronto su anillo se hará realidad.",
            confirmButtonText: "Seguir diseñando",
            showDenyButton: true,
            denyButtonText: "Salir del editor"
        })
    }

    static returnToMainMenu() {
        return Swal.fire({
            text: "¿Deseas guardar antes de salir?",
            showCancelButton: true,
            
            confirmButtonText: "Guardar",
            denyButtonText: "No guardar",
            showDenyButton: true,
            cancelButtonText: "Cancelar",
            reverseButtons: true
        })
    }

    static askToRestore() {
        return Swal.fire({
            title: "Continuar diseño",
            text: "Tienes un diseño sin guardar. ¿Quieres continuar donde lo dejaste?",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Nuevo diseño",
            reverseButtons: true
        })
    }

    static warningNewRing() {
        return Swal.fire({
          icon: "warning",
          title: "Diseño no guardado",
          text: "No ha guardado los cambios de su diseño actual ¿Qué quiere hacer?",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Guardar y crear",
          denyButtonText: "Descartar y crear",
          cancelButtonText: "Cancelar",
          reverseButtons: true
        });
    }

    static warningProfileNewRing() {
        return Swal.fire({
          icon: "warning",
          title: "Hay un diseño en curso",
          html: `
            <p>Si decide crear uno nuevo y no quiere perder los cambios del que tiene activo en el editor, compruebe que lo ha guardado previamente.</p>
          `,
          showCancelButton: true,
          confirmButtonText: "Cancelar",
          cancelButtonText: "Crear nuevo",
          reverseButtons: true
        });
    }

    static restrictionAlert() {
        return Swal.fire({
          title: "Inicie sesión",
          html: `
            <div class="getPDF">
                <p class="text-primary">Para acceder a esa funcionalidad debe iniciar sesión o crearse una cuenta.</p>
                <br>
                <p class="text-primary">(Se guardará su progreso automáticamente).</p>
            </div>`,
          confirmButtonText: "Iniciar sesión",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        });
    }

    static saveRing() {
        return Swal.fire({
            title: "Guarde su diseño",
            html: `
              <div class="getPDF">
                  <p class="text-primary">Para poder consultar los detalles de su diseño debe guardarlo primero.</p>
              </div>`,
            confirmButtonText: "Guardar",
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: "Cancelar",

            
        });
    }

    static successfullySaved() {
        return Swal.fire({
            icon: "success",
            title: "Diseño guardado exitosamente",
            text: "Se ha guardado correctamente su diseño, consúltelo cuando quiera en su perfil.",
            showCancelButton: false,
            confirmButtonText: "Aceptar",
        });
    }

    static downloadDetails() {
        return Swal.fire({
            title: "Descargar detalles",
            html: `
                <div class="getPDF">
                    <p class="text-primary">Se  descargará una ficha informativa en formato PDF que incluirá todos los detalles de su diseño y una imagen del renderizado de calidad. </p>
                    <div class="withPrice">
                        <p class="text-primary"s>Incluir precio </p>
                        <label class="switch">
                            <input type="checkbox" id="withPriceToggle">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                
                `,
            showCancelButton: true,
            confirmButtonText: "Descargar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,

            preConfirm: () => {
                const withPriceCheckbox = Swal.getPopup()?.querySelector(
                    "#withPriceToggle",
                ) as HTMLInputElement;
                // si lo devuelvo tal cual como booleano y es false no ejecuta el .then
                return {
                    withPrice: withPriceCheckbox?.checked ? true : false,
                };
            },
        })
    }
}
