export interface Event {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  date: Date;
}

export interface CreateEventDto {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  // ISO8601 Format
  date: string;
}

export interface UpdateEventDto {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  // ISO8601 Format
  date: string;
}
