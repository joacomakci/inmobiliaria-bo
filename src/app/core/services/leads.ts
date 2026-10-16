import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Lead, LeadStatus } from '../models/lead.model';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/leads`;

  findAll(filters?: { status?: LeadStatus; agentId?: string }) {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.agentId) params = params.set('agentId', filters.agentId);

    return this.http.get<Lead[]>(this.baseUrl, { params });
  }
}