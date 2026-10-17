import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Lead, LeadNote, LeadStatus } from '../models/lead.model';

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

  findOne(id: string) {
    return this.http.get<Lead>(`${this.baseUrl}/${id}`);
  }

  changeStatus(id: string, status: LeadStatus) {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}/status`, { status });
  }

  assignAgent(id: string, agentId: string) {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}/agent`, { agentId });
  }

  addNote(id: string, text: string) {
    return this.http.post<LeadNote>(`${this.baseUrl}/${id}/notes`, { text });
  }
}