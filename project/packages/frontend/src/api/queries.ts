import {
  Event,
  DonorsList,
  CreateEventDto,
  UpdateEventDto,
} from "@bc-cancer/shared/src/types/event";
import { Donor, GetDonorsParams } from "@bc-cancer/shared/src/types/donor";
import { EventChangeHistory } from "@bc-cancer/shared/src/types/change-history";

// Function to build query string from params
function buildQueryString(params: GetDonorsParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

// Add filter as query params
export const getDonors = async (params: GetDonorsParams = {}) => {
  const queryString = buildQueryString(params);
  const response = await fetch(`http://localhost:3000/donors?${queryString}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch donors");
  }
  return response.json() as Promise<Donor[]>;
};

export const getEventDonors = async (eventId: number) => {
  const response = await fetch(
    `http://localhost:3000/events/${eventId}/donors`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch donors");
  }
  return response.json() as Promise<DonorsList>;
};

export const editEventDonors = async ({
  eventId,
  donorIds,
  newStatus,
}: {
  eventId: number;
  donorIds: number[];
  newStatus: string;
}) => {
  const response = await fetch(
    `http://localhost:3000/events/${eventId}/donors`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ donorIds, newStatus }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to edit donors");
  }
};

export const getEvents = async () => {
  const response = await fetch("http://localhost:3000/events", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json() as Promise<Event[]>;
};

export const createEvent = async (event: CreateEventDto) => {
  const response = await fetch("http://localhost:3000/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error("Failed to create event");
  }
  return response.json() as Promise<Event>;
};

export const updateEvent = async ({
  eventId,
  event,
}: {
  eventId: number;
  event: UpdateEventDto;
}) => {
  const response = await fetch(`http://localhost:3000/events/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error("Failed to update event");
  }
  return response.json() as Promise<Event>;
};

export const deleteEvent = async (eventId: number) => {
  const response = await fetch(`http://localhost:3000/events/${eventId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
  return response.json() as Promise<Event>;
};

export const getEventChangeHistory = async (eventId: number) => {
  const response = await fetch(`http://localhost:3000/events/${eventId}/history`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch event change history");
  }
  return response.json() as Promise<EventChangeHistory[]>;
}
