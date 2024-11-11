import { EventForm } from "@/components/event-form";
import { UserAvatar } from "@/components/user-avatar";

export default function CreateEvent() {
  return (
    <div className="container mx-auto py-10">
      {/* Header Row with Avatar */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">Create Event</h1>
        <UserAvatar />
      </div>

      {/* Event Form */}
      <EventForm />
    </div>
  );
}
