import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private httpClient = inject(HttpClient);

  getSettings() {
    return this.httpClient.get<any>(`${environment.apiUrl}/settings`)
  }

  getSettingsById(id: string) {
    return this.httpClient.get(`${environment.apiUrl}/settings/${id}`)
  }
}
