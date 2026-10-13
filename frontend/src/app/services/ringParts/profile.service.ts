import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private httpClient = inject(HttpClient);

  getProfiles() {
    return this.httpClient.get<any>(`${environment.apiUrl}/profiles`)
  }
}
