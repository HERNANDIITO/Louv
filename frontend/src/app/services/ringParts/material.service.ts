import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private httpClient = inject(HttpClient);

  getMaterials() {
    return this.httpClient.get<any>(`${environment.apiUrl}/materials`)
  }

  getMaterialById(id: string) {
    return this.httpClient.get(`${environment.apiUrl}/materials/${id}`)
  }

  
}
