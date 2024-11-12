import { Event } from "@bc-cancer/shared/src/types/event";
import { Donor } from "@bc-cancer/shared/src/types/donor";
import { CreateEventDto } from "@bc-cancer/shared/src/types/event";

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

// TODO: add filter as query params
export const getDonors = async () => {
  const response = await fetch("http://localhost:3000/donors", {
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