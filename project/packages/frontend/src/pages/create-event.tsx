import { EventForm } from "@/components/event-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 

export default function CreateEvent() {
  return (
    <div className="container mx-auto py-10">
      {/* Header Row with Avatar */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">Create Event</h1>
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback> {/* Placeholder initial */}
        </Avatar>
      </div>

      {/* Event Form */}
      <EventForm />
    </div>
  );
}
