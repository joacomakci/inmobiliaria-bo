import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  LucideBuilding2,
  LucideCalendarCheck,
  LucideMessageSquareText,
  LucideTrendingUp,
} from '@lucide/angular';
import { AuthService } from '../../../core/auth/auth.service';
import { DashboardService } from '../../../core/services/dashboard';
import { LeadsService } from '../../../core/services/leads';
import { PropertiesService } from '../../../core/services/properties';
import { DashboardSummary } from '../../../core/models/dashboard.model';
import { Lead, LeadStatus } from '../../../core/models/lead.model';
import { Property } from '../../../core/models/property.model';
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  OPERATION_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
} from '../../../core/models/labels';
import { timeAgo } from '../../../core/utils/time-ago';
import { StatCard } from '../../../shared/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, StatCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly leadsService = inject(LeadsService);
  private readonly propertiesService = inject(PropertiesService);

  readonly loading = signal(true);
  readonly error = signal(false);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly byStatus = signal<Record<string, number>>({});
  readonly leads = signal<Lead[]>([]);
  readonly properties = signal<Property[]>([]);

  readonly icons = {
    properties: LucideBuilding2,
    leads: LucideMessageSquareText,
    visits: LucideCalendarCheck,
    conversion: LucideTrendingUp,
  };

  readonly leadStatusLabels = LEAD_STATUS_LABELS;
  readonly leadSourceLabels = LEAD_SOURCE_LABELS;
  readonly propertyStatusLabels = PROPERTY_STATUS_LABELS;
  readonly propertyTypeLabels = PROPERTY_TYPE_LABELS;
  readonly operationLabels = OPERATION_LABELS;
  readonly timeAgo = timeAgo;

  readonly today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  readonly name = computed(() => this.auth.user()?.email.split('@')[0] ?? '');

  // Embudo acumulado: cada etapa cuenta las consultas que llegaron hasta ahí
  // o más lejos. Las perdidas no se suman (no sabemos en qué etapa se cayeron).
  readonly funnel = computed(() => {
    const counts = this.byStatus();
    const count = (status: LeadStatus) => counts[status] ?? 0;

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const reached = (...statuses: LeadStatus[]) =>
      statuses.reduce((sum, status) => sum + count(status), 0);

    const rows = [
      { label: 'Consultas recibidas', value: total },
      {
        label: 'Contactadas',
        value: reached('contactado', 'visita_agendada', 'en_negociacion', 'ganado'),
      },
      { label: 'Visitas agendadas', value: reached('visita_agendada', 'en_negociacion', 'ganado') },
      { label: 'En negociación', value: reached('en_negociacion', 'ganado') },
      { label: 'Ganadas', value: reached('ganado') },
    ];

    return rows.map((row) => ({
      ...row,
      width: total > 0 ? (row.value / total) * 100 : 0,
    }));
  });

  ngOnInit(): void {
    forkJoin({
      summary: this.dashboardService.summary(),
      byStatus: this.dashboardService.leadsByStatus(),
      leads: this.leadsService.findAll(),
      properties: this.propertiesService.findAll(),
    }).subscribe({
      next: ({ summary, byStatus, leads, properties }) => {
        this.summary.set(summary);
        this.byStatus.set(
          Object.fromEntries(byStatus.map((row) => [row.status, Number(row.count)])),
        );
        this.leads.set(leads.slice(0, 5));
        this.properties.set(properties.slice(0, 4));
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  initials(lead: Lead): string {
    return ((lead.firstName[0] ?? '') + (lead.lastName?.[0] ?? '')).toUpperCase();
  }
}