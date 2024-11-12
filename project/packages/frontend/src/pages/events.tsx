import { columns } from "@/components/event-columns"
import { EventDataTable } from "@/components/data-table"
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "../AuthContext";
import { getEvents } from "@/api/queries";
import { useQuery } from "@tanstack/react-query";

export default function Events() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
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
      {data && <EventDataTable columns={columns} data={data} />}
    </div>
  )
}

