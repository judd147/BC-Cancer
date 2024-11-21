import { Donor, DonorStatus } from "./donor";
import { User } from "./user";

/**
 * Represents an event with core properties.
 * The response from "GET /events/:id" or "GET /events" endpoints.
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
  /** Tags of the event */
  tags: string[];
}

/**
 * DTO for creating a new event.
 * Used in the request body of "POST /events" endpoint.
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
  /** Comment to be included with the change history (optional) */
  comment?: string;
  /** List of tags for the event (optional) */
  tags?: string[];
}

/**
 * DTO for updating the details of an existing event.
 * Used in the request body of "PATCH /events/:id" endpoint.
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
  /** Comment to be included with the change history (optional) */
  comment?: string;
  /** Updated list of tags for the event (optional) */
  tags?: string[];
}

/**
 * DTO for updating the status of donors associated with an event.
 * Used in the request body of "PATCH /events/:id/donors" endpoint.
 */
export interface UpdateDonorsStatusDto {
  /** List of donor IDs to update */
  donorIds: number[];
  /** New status to set for the donors */
  newStatus: DonorStatus;
  /** Comment to be included with the change history (optional) */
  comment?: string;
}

/**
 * Represents an event with donor status information.
 * The response from "GET /events/:id" endpoint.
 */
export type DonorsList = {
  [key in DonorStatus]: (Donor & { comment?: string })[];
};
