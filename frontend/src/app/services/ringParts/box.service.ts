import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private httpClient = inject(HttpClient);

  getBoxes() {
    return this.httpClient.get<any>(`${environment.apiUrl}/box/`)
  }

  getInnerMaterials()  { return this.httpClient.get<any>(`${environment.apiUrl}/box/innerMaterials/` ) }
  getOuterMaterials()  { return this.httpClient.get<any>(`${environment.apiUrl}/box/uuterMaterials/` ) }
  getDetailMaterials() { return this.httpClient.get<any>(`${environment.apiUrl}/box/detailMaterials/`) }

  getCompatibleInnerMaterialsById(id: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}/box/${id}/innerMaterials/`)
  }

  getCompatibleOuterMaterialsById(id: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}/box/${id}/outerMaterials/`)
  }

  getCompatibleDetailMaterialsById(id: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}/box/${id}/detailMaterials/`)
  }
}
