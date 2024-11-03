export interface Event {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string | null;
  date: Date;
}

export interface CreateEventDto {
  name: string;
  location: string;
  // ISO8601 Format
  date: string;
}

export interface UpdateEventDto {
  name?: string;
  location?: string;
  // ISO8601 Format
  date?: string;
}
