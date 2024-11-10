import { Donor } from "./donor";
import { User } from "./user";

export interface Event {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  date: Date | string;
  donorsList?: Donor[];
  createdBy: User;
  admins: User[];
}

export interface CreateEventDto {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  // ISO8601 Format
  date: string;
  donorsList?: number[]; // Donor IDs
  admins?: number[]; // User IDs
}

export interface UpdateEventDto {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  description?: string;
  // ISO8601 Format
  date?: string;
  donorsList?: number[];
  admins?: number[];
}
