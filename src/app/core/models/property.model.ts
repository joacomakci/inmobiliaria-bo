export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina';
export type PropertyOperation = 'venta' | 'alquiler';
export type PropertyStatus = 'disponible' | 'reservada' | 'vendida' | 'alquilada';

export interface PropertyImage {
  id: string;
  url: string;
  order: number;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  operation: PropertyOperation;
  price: string; // el backend manda los decimales como string ("150000.00")
  currency: string;
  address: string;
  city: string;
  neighborhood?: string | null;
  areaM2?: number | null;
  rooms?: number | null;
  bathrooms?: number | null;
  status: PropertyStatus;
  featured: boolean;
  agent: Agent;
  images: PropertyImage[];
  createdAt: string;
}