import { Donor, DonorStatus } from "./donor";
import { User } from "./user";

/**
 * Represents an event with core properties.
 */
export interface Event {
  /** Unique identifier for the event */
  id: number;
  /** Name of the event */
  name: string;
  /** Primary address line for the event's location */
  addressLine1: string;
  /** Secondary address line for the event's location (optional) */
  addressLine2?: string;
  /** City where the event is held */
  city: string;
  /** Description of the event (optional) */
  description?: string;
  /** Date of the event */
  date: Date | string;
  /** User who created the event */
  createdBy: User;
  /** List of users who have admin privileges for the event */
  admins: User[];
}

/**
 * DTO for creating a new event.
 */
export interface CreateEventDto {
  /** Name of the event */
  name: string;
  /** Primary address line for the event's location */
  addressLine1: string;
  /** Secondary address line for the event's location (optional) */
  addressLine2?: string;
  /** City where the event is held */
  city: string;
  /** Description of the event (optional) */
  description?: string;
  /** Date of the event in ISO8601 format */
  date: string;
  /** List of donor IDs to be included in the event's initial donor pool */
  donorIds: number[];
  /** List of user IDs who will have admin privileges (optional) */
  admins?: number[];
}

/**
 * DTO for updating the details of an existing event.
 */
export interface UpdateEventDto {
  /** New name for the event (optional) */
  name?: string;
  /** Updated primary address line for the event's location (optional) */
  addressLine1?: string;
  /** Updated secondary address line for the event's location (optional) */
  addressLine2?: string;
  /** Updated city where the event is held (optional) */
  city?: string;
  /** Updated description of the event (optional) */
  description?: string;
  /** Updated date of the event in ISO8601 format (optional) */
  date?: string;
  /** Updated list of user IDs for admin privileges (optional) */
  admins?: number[];
}

/**
 * DTO for updating the status of donors associated with an event.
 */
export interface UpdateDonorsStatusDto {
  /** List of donor IDs to update */
  donorIds: number[];
  /** New status to set for the donors */
  newStatus: DonorStatus;
}

/**
 * Represents an event with donor status information.
 */
export type DonorsList = { [key in DonorStatus]: Donor[] };
