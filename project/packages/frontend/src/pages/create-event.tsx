import { EventForm } from "@/components/event-form";

export default function CreateEvent() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold py-4">Create Event</h1>
      <EventForm />
    </div>
  );
}
