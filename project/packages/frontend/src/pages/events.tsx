import { columns } from "@/components/event-columns"
import { Event } from "@bc-cancer/shared/src/types/event";
import { EventDataTable } from "@/components/data-table"
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Events() {
  const { user } = useAuth();

  const { data: events, isLoading, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/events", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json() as Promise<Event[]>;
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold py-4">Events</h1>
        {user && <p>Welcome, {user.username}!</p>}
        <UserAvatar />
      </div>
      {isLoading && <p>Loading events...</p>}
      {isError && <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>}

      {events && <EventDataTable columns={columns} data={events} />}
    </div>
  )
}

