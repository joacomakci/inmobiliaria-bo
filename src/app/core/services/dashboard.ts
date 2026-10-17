import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardSummary, LeadsByDay, StatusCount } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  summary() {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  leadsByStatus() {
    return this.http.get<StatusCount[]>(`${this.baseUrl}/leads-by-status`);
  }

    leadsByDay(days = 30) {
    return this.http.get<LeadsByDay[]>(`${this.baseUrl}/leads-by-day`, {
      params: { days },
    });
  }
}