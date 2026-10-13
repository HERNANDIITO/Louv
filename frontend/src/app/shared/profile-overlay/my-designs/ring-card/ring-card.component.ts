import { Component, inject, input, output } from "@angular/core";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ring } from "../../../../interfaces/ring.model";
import {
  faPaperPlane,
  faDownload,
  faPen,
  faTrash,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../../../services/auth.service";
import Swal from "sweetalert2";
import { JewelService } from "../../../../services/jewel.service";

@Component({
  selector: "app-ring-card",
  imports: [FontAwesomeModule],
  templateUrl: "./ring-card.component.html",
  styleUrl: "./ring-card.component.scss",
})
export class RingCardComponent {
  faPaperPlane = faPaperPlane;
  faDownload = faDownload;
  faPen = faPen;
  faTrash = faTrash;
  faBagShopping = faBagShopping;
  
  ringData = input.required<Ring>();
  selected = input.required<boolean>();
  router: any;

  authService = inject(AuthService);
  jewelService = inject(JewelService);
  reloadTrigger = new Date().getTime();

  onDownloadPDF(id: string){

    Swal.fire({
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
    }).then((result) => {
      if (result.isConfirmed) {
        const withPrice = result.value.withPrice;

        this.jewelService.getMyJewelPDF(id!, withPrice).subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          }
        });
      }
    });
      
  }
}
