import { Donor } from "./donor";

export interface Event {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  date: Date;
  donorsList?: Donor[];
}

export interface CreateEventDto {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  // ISO8601 Format
  date: string;
  donorsList?: string[]; // Donor IDs
}

export interface UpdateEventDto {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  description?: string;
  // ISO8601 Format
  date?: string;
  donorsList?: string[];
}
