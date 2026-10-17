import { Agent, Property } from './property.model';

export type LeadStatus =
  | 'nuevo'
  | 'contactado'
  | 'visita_agendada'
  | 'en_negociacion'
  | 'ganado'
  | 'perdido';

export type LeadSource = 'landing_form' | 'whatsapp' | 'telefono' | 'referido';

// Dentro de una consulta, la API no trae todos los campos de la propiedad
export type LeadProperty = Pick<
  Property,
  | 'id'
  | 'title'
  | 'slug'
  | 'type'
  | 'operation'
  | 'price'
  | 'currency'
  | 'address'
  | 'city'
  | 'neighborhood'
>;

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  authorUser?: { id: string; email: string; role: string };
}

export interface Lead {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  property?: LeadProperty | null;
  agent?: Agent | null;
  notes?: LeadNote[];
  createdAt: string;
  updatedAt: string;
}