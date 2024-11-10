import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/donor-columns"
import { DataTable } from "@/components/data-table"

export default function EventDetail() {
  const location = useLocation();
  const { event } = location.state;

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Event Title */}
      <h1 className="text-4xl font-bold text-center">{event.name}</h1>

      {/* Event Details Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2">
              <p>Date: {event.date}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">We look forward to seeing you at the event!</p>
        </CardFooter>
      </Card>

      {/* Location Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Address: {event.addressLine1}, {event.addressLine2}</p>
            <p>City: {event.city}</p>
          </div>
        </CardContent>
      </Card>

      {/* Separator and Footer Section */}
      <Separator />
      <DataTable columns={columns} data={event.donorsList} />
    </div>
  )
}
