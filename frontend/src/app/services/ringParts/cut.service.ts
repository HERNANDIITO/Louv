import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CutService {
  private httpClient = inject(HttpClient);

  getCuts() {
    return this.httpClient.get<any>(`${environment.apiUrl}/cuts`)
  }

  getCutById(id: string) {
    return this.httpClient.get(`${environment.apiUrl}/cuts/${id}`)
  }

}
