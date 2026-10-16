import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/properties`;

  findAll() {
    return this.http.get<Property[]>(this.baseUrl);
  }
}