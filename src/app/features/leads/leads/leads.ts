import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgentsService } from '../../../core/services/agents';
import { LeadsService } from '../../../core/services/leads';
import { Agent } from '../../../core/models/property.model';
import { Lead, LeadStatus } from '../../../core/models/lead.model';
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from '../../../core/models/labels';
import { timeAgo } from '../../../core/utils/time-ago';

@Component({
  selector: 'app-leads',
  imports: [RouterLink],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads implements OnInit {
  private readonly leadsService = inject(LeadsService);
  private readonly agentsService = inject(AgentsService);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly leads = signal<Lead[]>([]);
  readonly agents = signal<Agent[]>([]);

  readonly status = signal<LeadStatus | ''>('');
  readonly agentId = signal('');

  readonly statuses = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];
  readonly statusLabels = LEAD_STATUS_LABELS;
  readonly sourceLabels = LEAD_SOURCE_LABELS;
  readonly timeAgo = timeAgo;

  ngOnInit(): void {
    this.agentsService.findAll().subscribe({
      next: (agents) => this.agents.set(agents),
      error: (err: unknown) => console.error(err),
    });
    this.load();
  }

  setStatus(status: LeadStatus | ''): void {
    this.status.set(status);
    this.load();
  }

  onAgentChange(event: Event): void {
    this.agentId.set((event.target as HTMLSelectElement).value);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.leadsService
      .findAll({
        status: this.status() || undefined,
        agentId: this.agentId() || undefined,
      })
      .subscribe({
        next: (leads) => {
          this.leads.set(leads);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}