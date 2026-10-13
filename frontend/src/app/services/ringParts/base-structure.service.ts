import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseStructure } from '../../interfaces/baseStructure.interface';

@Injectable({
  providedIn: 'root'
})
export class BaseStructureService {
  private httpClient = inject(HttpClient);

  getBaseStructures() {
    return this.httpClient.get<any>(`${environment.apiUrl}/baseStructures`)
  }

  getBaseStructureById(id: string) {
    return this.httpClient.get<BaseStructure>(`${environment.apiUrl}/baseStructures/${id}`)
  }
}
