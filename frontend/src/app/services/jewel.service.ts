import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpContext } from "@angular/common/http";
import { NewJewel } from "../interfaces/jewel.interface";
import { USE_AUTH } from "../context/auth.context";
import { FORCE_JSON } from "../context/json.context";
import { tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JewelService {
  private httpClient = inject(HttpClient);

  getJewelById(id: string) {
    return this.httpClient.get(`${environment.apiUrl}/users/me/jewels/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Recoge el PDF con los detalles del anillo activo del usuario.
   *
   * @param withPrice Booleano que indica si se quiere incluir el precio o no.
   * @returns Observable de la respuesta del backend.
   */
  getMyJewelPDF(id: string, withPrice: boolean) {
    return this.httpClient.get<Blob>(
      `${environment.apiUrl}/users/me/jewels/${id}/pdf`,
      {
        withCredentials: true,
        params: { withPrice: withPrice.toString() },
        responseType: "blob" as "json",
      },
    );
  }
  
  /**
   * Obtiene la lista de anillos del usuario.
   *
   * @returns Observable que emite un arreglo de anillos simulados.
   *
   * @note Actualmente simula la respuesta con un retraso de 300 ms.
   */
  getUserRings() {
    return this.httpClient
      .get(`${environment.apiUrl}/users/me/jewels`, {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      });
  }

  getPriceQuote(jewelData: any) {
    return this.httpClient.post(`${environment.apiUrl}/jewels/price-quote`, jewelData, {
      withCredentials: true,
    });
  }

  getJewelPhotoUrl(id: string): string {
    return `${environment.apiUrl}/users/me/jewels/${id}/photo`;
  }

  /**
   * Inicia sesión de un usuario con email y contraseña.
   *
   * @param formData Datos del formulario de login.
   * @returns Observable de la respuesta del backend.
   */
  postRing(newJewel: NewJewel) {
    return this.httpClient.post(`${environment.apiUrl}/jewels`, newJewel, {
      withCredentials: true,
    });
  }

  updateRing(jewelId: string, updatedJewel: NewJewel) {
    return this.httpClient.put(`${environment.apiUrl}/users/me/jewels/${jewelId}`, updatedJewel, {
      withCredentials: true,
    });
  }

  updateRingName(jewelId: string, name: string) {
    const url = `${environment.apiUrl}/users/me/jewels/${jewelId}/name`;
    return this.httpClient.put(
      url,
      { name },
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
      },
    );
  }

  deleteRing(jewelId: string) {
    const url = `${environment.apiUrl}/users/me/jewels/${jewelId}`;
    return this.httpClient.delete(url, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    });
  }

  shareJewel(jewelId: string, withPrice: boolean = false) {
    let url = `${environment.apiUrl}/users/me/jewels/${jewelId}/`;

    if ( withPrice ) {
      url += "shareHashWithPrice";
    } else {
      url += "shareHashWithoutPrice"
    }

    return this.httpClient.put(url, {}, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    })
  }

  getIDByHash(jewelHash: string) {
    let url = `${environment.apiUrl}/jewels/shared/${jewelHash}`;
    return this.httpClient.get(url, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    })
  }
}
