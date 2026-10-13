import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { RingCardComponent } from "./ring-card/ring-card.component";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Ring } from '../../../interfaces/ring.model';
import { JewelService } from '../../../services/jewel.service';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronRight, faCopy, faPen, faPlusCircle, faShareNodes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';
import { JewelHelper } from '../../../helpers/jewels.helper';
import { VisorComponent } from "../../../components/visor/visor.component";
import { ShareComponent } from "../../../components/editor/share/share.component";
import { AuthSrcDirective } from '../../../directives/auth-src.directive';
import { HttpClient, HttpContext } from '@angular/common/http';
import { USE_AUTH } from '../../../context/auth.context';
import { AlertHelper } from '../../../helpers/alerts.helper';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-my-designs',
  imports: [RingCardComponent, FaIconComponent, VisorComponent, ShareComponent],
  templateUrl: './my-designs.component.html',
  styleUrl: './my-designs.component.scss',
  providers: [EditJewelService]
})
export class MyDesignsComponent implements OnInit, OnDestroy {
  rings = signal<Ring[]>([]);
  share = signal<boolean>(false);
  selectedRing = signal<Ring>(this.Ring());
  
  ringService = inject(JewelService);
  router = inject(Router);
  close = output();
  editJewelService = inject(EditJewelService);
  jewelService = inject(JewelService);
  http = inject(HttpClient);
  orderService = inject(OrderService);


  icons = {
    faTrash, faCopy, faShareNodes, faPen, faChevronRight, faPlusCircle
  }


  private nameChangeTimers: Record<string, any> = {}; // Clave: id del anillo
  private readonly DEBOUNCE_DELAY = 500; // 500ms o lo que necesites

  Ring(): Ring {
    return {
      id: '',
      nombre: '',
      img: '',
      precio: 0
    }
  }

  ngOnInit() {
    this.editJewelService.ensureCatalogs();
    this.ringService.getUserRings().subscribe((res: any) => {
      const mappedRings = (res.jewels ?? []).map((r: any) => ({
        id: r._id, // string
        nombre: r.name,
        img: r.snapshot,
        precio: r.currentPrice.$numberDecimal
      }));

      this.rings.set(mappedRings);
    });
  }

  ngOnDestroy(): void {
    this.selectedRing.set(this.Ring())
  }

  toggleShare() {
    this.share.set(!this.share())
  }

  selectRing(ring: Ring) {
    this.selectedRing.set(ring);
  }

  onNameChange(newName: string, id: string) {
    const oldRings = this.rings();
    const oldName = oldRings.find((r) => r.id === id)?.nombre;

    // Actualización optimista en UI
    this.rings.update((rings) =>
      rings.map((r) => (r.id === id ? { ...r, nombre: newName } : r)),
    );

    // Limpiar timer anterior si existe
    if (this.nameChangeTimers[id]) {
      clearTimeout(this.nameChangeTimers[id]);
    }

    // Crear nuevo timer
    this.nameChangeTimers[id] = setTimeout(() => {
      this.ringService.updateRingName(id, newName).subscribe({
        error: () => {
          // Revertir si hubo error
          if (oldName) {
            this.rings.update((rings) =>
              rings.map((r) => (r.id === id ? { ...r, nombre: oldName } : r)),
            );
          }
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo guardar el cambio.",
            confirmButtonText: "Aceptar",
          });
        },
      });

      // Limpiar referencia del timer
      delete this.nameChangeTimers[id];
    }, this.DEBOUNCE_DELAY);
  }

  onDeleteRing(id: string) {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar anillo?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      const old = this.rings();

      // 🔹 Optimistic UI
      this.rings.update((r) => r.filter((ring) => ring.id !== id));

      this.ringService.deleteRing(id).subscribe({
        next: () => {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El anillo ha sido eliminado.",
            confirmButtonText: "Aceptar",
          });
          this.selectedRing.set(this.Ring())
          if ( this.router.url.includes(id) ) {
            this.router.navigate([`/editor3d/`])
          }
        },
        error: () => {
          this.rings.set(old);

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el anillo.",
            confirmButtonText: "Cerrar",
          });
        },
      });
    });
  }

  onEditRing(id: string) {
    this.close.emit();
    this.router.navigate([`/editor3d/${id}`]);
  }

  buyRing() {
    if (!this.selectedRing()) return;

    this.orderService.postOrder(this.selectedRing().id).subscribe();

    AlertHelper.buyRing().then(res => {
      if (res.isDenied) {
        this.router.navigate(['/']);
        this.close.emit();
      }
    })
  }

  newRing() {
    AlertHelper.warningProfileNewRing().then((res) => {
      if(res.isDismissed){
        this.editJewelService.clearStoredJewel();
        this.editJewelService.setDefaultJewel();

        this.ringService.postRing(this.editJewelService.getJewelForSaving()).subscribe({
          next: (response: any) => {
            const newRingData = response.jewel || response;

            const newRing: Ring = {
              id: newRingData._id,
              nombre: newRingData.name,
              img: newRingData.snapshot,
              precio: newRingData.currentPrice
            };

            this.router.navigate([`/editor3d/${newRing.id}`], { replaceUrl: true });
            this.close.emit();
          }
        });
      }
    });
  }


  private async downloadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, {
        responseType: 'blob',
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true)
      }).subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        },
        error: (err) => reject(err)
      });
    });
  }

  onCopy(id: string) {
    if (!this.selectedRing) return;

    this.ringService.getJewelById(id).subscribe({
      next: async (jewelRes: any) => {
        const originalPhotoUrl = this.jewelService.getJewelPhotoUrl(id);

        // 2. Convertimos esa imagen física a Base64 (los datos reales de la imagen)
        const imageBase64 = await this.downloadImageAsBase64(originalPhotoUrl);

        const catalogs = this.editJewelService.getCatalog();
        const jewelConverted = JewelHelper.transformJewelryToNewJewel(jewelRes.jewel, catalogs);

        // 3. Preparamos el payload
        const payload = JewelHelper.getJewelForSaving(jewelConverted);

        // 4. LE PASAMOS LOS DATOS DE LA IMAGEN
        // Así el servidor recibirá el archivo real y lo guardará como "anillo_NUEVOID.png"
        payload.snapshot = imageBase64;
        payload.name = jewelRes.jewel.name + " (Copia)";

        // Enviar a guardar
        this.ringService.postRing(payload).subscribe({
          next: (response: any) => {

            const newRingData = response.jewel || response;

            const newRing: Ring = {
              id: newRingData._id,
              nombre: newRingData.name,
              img: newRingData.snapshot,
              precio: newRingData.currentPrice
            };

            this.selectRing(newRing);

            // Actualizamos rings en front añadiendo el nuevo
            this.rings.update(currentRings => [newRing, ...currentRings]);

            Swal.fire("Duplicado con éxito", "Tu diseño ha sido duplicado correctamente", "success");
          },
          error: () => {
            Swal.fire("Error", "No se pudo crear la copia", "error");
          }
        });
      }
    });
  }
}
