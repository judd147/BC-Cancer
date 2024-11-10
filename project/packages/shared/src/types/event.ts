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
  donorsList: Donor[];
  excludedDonors: Donor[];
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
  excludedDonors?: number[]; // Donor IDs
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
  excludedDonors?: number[];
  admins?: number[];
}
