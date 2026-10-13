import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GemService {
  private httpClient = inject(HttpClient);

  getGems() {
    return this.httpClient.get<any>(`${environment.apiUrl}/gemStones`)
  }

  getGemById(id: string) {
    return this.httpClient.get(`${environment.apiUrl}/gemStones/${id}`)
  }
}
