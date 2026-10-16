import { LeadSource, LeadStatus } from './lead.model';
import { PropertyOperation, PropertyStatus, PropertyType } from './property.model';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  visita_agendada: 'Visita agendada',
  en_negociacion: 'En negociación',
  ganado: 'Ganado',
  perdido: 'Perdido',
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  landing_form: 'Formulario web',
  whatsapp: 'WhatsApp',
  telefono: 'Teléfono',
  referido: 'Referido',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  vendida: 'Vendida',
  alquilada: 'Alquilada',
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina',
};

export const OPERATION_LABELS: Record<PropertyOperation, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
};