import { Event } from "@bc-cancer/shared/src/types/event";
import { Donor } from "@bc-cancer/shared/src/types/donor";
import { CreateEventDto } from "@bc-cancer/shared/src/types/event";
import { GetDonorsParams } from "@bc-cancer/shared/src/types/donor";

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