import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SizesService {
  private httpClient = inject(HttpClient);

  getSizes() {
    return this.httpClient.get<any>(`${environment.apiUrl}/sizes`)
  }

  getSizeById(id: string) {
    return this.httpClient.get(`${environment.apiUrl}/sizes/${id}`)
  }
}
