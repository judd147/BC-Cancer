import { EventForm } from "@/components/event-form";
import { UserAvatar } from "@/components/user-avatar";
import { useLocation } from "react-router-dom";
import { Event } from "@bc-cancer/shared/src/types/event";

export default function EditEvent() {
  const location = useLocation();
  const { event }: { event: Event } = location.state;
  console.log("Edit event:", event);
  return (
    <div className="container mx-auto py-10">
      {/* Header Row with Avatar */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">Edit Event</h1>
        <UserAvatar />
      </div>

      {/* Event Form */}
      <EventForm event={event} />
    </div>
  );
}
