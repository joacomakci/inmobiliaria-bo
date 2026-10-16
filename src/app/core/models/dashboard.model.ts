export interface DashboardSummary {
  totalProperties: number;
  totalLeads: number;
  leadsGanados: number;
  leadsNuevos: number;
  conversionRate: number;
}

// Postgres devuelve los COUNT como string
export interface StatusCount {
  status: string;
  count: string;
}