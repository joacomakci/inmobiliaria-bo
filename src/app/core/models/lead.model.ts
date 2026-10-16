import { Agent, Property } from './property.model';

export type LeadStatus =
  | 'nuevo'
  | 'contactado'
  | 'visita_agendada'
  | 'en_negociacion'
  | 'ganado'
  | 'perdido';

export type LeadSource = 'landing_form' | 'whatsapp' | 'telefono' | 'referido';

export interface Lead {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  property?: Property | null;
  agent?: Agent | null;
  createdAt: string;
  updatedAt: string;
}