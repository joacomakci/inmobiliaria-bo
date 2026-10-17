import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AgentsService } from '../../../core/services/agents';
import { LeadsService } from '../../../core/services/leads';
import { Agent } from '../../../core/models/property.model';
import { Lead, LeadStatus } from '../../../core/models/lead.model';
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from '../../../core/models/labels';

@Component({
  selector: 'app-lead-detail',
  imports: [DatePipe, DecimalPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './lead-detail.html',
  styleUrl: './lead-detail.scss',
})
export class LeadDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly leadsService = inject(LeadsService);
  private readonly agentsService = inject(AgentsService);

  readonly lead = signal<Lead | null>(null);
  readonly agents = signal<Agent[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly saving = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly isAdmin = computed(() => this.auth.user()?.role === 'admin');

  readonly statuses = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];
  readonly statusLabels = LEAD_STATUS_LABELS;
  readonly sourceLabels = LEAD_SOURCE_LABELS;

  readonly noteControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.leadsService.findOne(id).subscribe({
      next: (lead) => {
        this.lead.set(lead);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        this.error.set(true);
        this.loading.set(false);
      },
    });

    // Solo el admin puede reasignar, así que solo él necesita la lista de agentes
    if (this.isAdmin()) {
      this.agentsService.findAll().subscribe({
        next: (agents) => this.agents.set(agents),
        error: (err: unknown) => console.error(err),
      });
    }
  }

  changeStatus(event: Event): void {
    const item = this.lead();
    if (!item) return;

    const select = event.target as HTMLSelectElement;
    const status = select.value as LeadStatus;
    if (status === item.status) return;

    this.saving.set(true);
    this.actionError.set(null);

    this.leadsService.changeStatus(item.id, status).subscribe({
      next: (updated) => {
        this.lead.set(updated);
        this.saving.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        select.value = item.status;
        this.actionError.set('No se pudo cambiar el estado. Probá de nuevo.');
        this.saving.set(false);
      },
    });
  }

  assignAgent(event: Event): void {
    const item = this.lead();
    if (!item) return;

    const select = event.target as HTMLSelectElement;
    if (!select.value || select.value === item.agent?.id) return;

    this.saving.set(true);
    this.actionError.set(null);

    this.leadsService.assignAgent(item.id, select.value).subscribe({
      next: (updated) => {
        this.lead.set(updated);
        this.saving.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        select.value = item.agent?.id ?? '';
        this.actionError.set('No se pudo asignar el agente. Probá de nuevo.');
        this.saving.set(false);
      },
    });
  }

  addNote(): void {
    const item = this.lead();
    const text = this.noteControl.value.trim();
    if (!item || !text) return;

    this.saving.set(true);
    this.actionError.set(null);

    this.leadsService.addNote(item.id, text).subscribe({
      next: () => {
        this.noteControl.reset();
        // Volvemos a pedir la consulta para traer la nota con su autor
        this.leadsService.findOne(item.id).subscribe({
          next: (updated) => {
            this.lead.set(updated);
            this.saving.set(false);
          },
          error: () => this.saving.set(false),
        });
      },
      error: (err: unknown) => {
        console.error(err);
        this.actionError.set('No se pudo guardar la nota. Probá de nuevo.');
        this.saving.set(false);
      },
    });
  }

  whatsappLink(phone: string): string {
    return `https://wa.me/${phone.replace(/\D/g, '')}`;
  }
}