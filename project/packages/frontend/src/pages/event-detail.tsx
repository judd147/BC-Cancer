// Import statements
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { Event } from "@bc-cancer/shared/src/types/event";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createColumns } from "@/components/donor-columns";
import { DonorDataTable } from "@/components/data-table";
import { ChangeHistoryScroll } from "@/components/change-history-scroll";
import { options } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getEventDonors } from "@/api/queries";
import { Button } from "@/components/ui/button"; 
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"; 

export default function EventDetail() {
  const location = useLocation();
  const { event }: { event: Event } = location.state;

  const { data } = useQuery({
    queryKey: ["donors", event.id],
    queryFn: () => getEventDonors(event.id),
  });

  const previewDonors = data?.preview || [];
  const invitedDonors = data?.invited || [];
  const excludedDonors = data?.excluded || [];

  const columns = useMemo(() => createColumns(event.id), [event.id]);

  // State to control the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
              <p>
                Date: {new Date(event.date).toLocaleString("en-CA", options)}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            We look forward to seeing you at the event!
          </p>
        </CardFooter>
      </Card>

      {/* Location Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              Address: {event.addressLine1}{" "}
              {event.addressLine2 && `, ${event.addressLine2}`}
            </p>
            <p>City: {event.city}</p>
          </div>
        </CardContent>
      </Card>

      {/* Change History Toggle Button under Location Card */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button type="button" className="mt-4">
            {isSidebarOpen ? "Hide Change History" : "Show Change History"}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-100 flex flex-col">
          <SheetHeader>
            <SheetTitle>Change History</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex-grow overflow-y-auto">
            <ChangeHistoryScroll eventId={event.id} />
          </div>
          <SheetClose asChild>
            <Button type="button" className="mt-4">
              Close
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>

      <Separator />

      {/* Tabs for Donors List */}
      <Tabs defaultValue="preview">
        <TabsList className="grid grid-cols-3 w-1/3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="invited">Invited</TabsTrigger>
          <TabsTrigger value="excluded">Excluded</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <DonorDataTable columns={columns} data={previewDonors} />
        </TabsContent>
        <TabsContent value="invited">
          <DonorDataTable columns={columns} data={invitedDonors} />
        </TabsContent>
        <TabsContent value="excluded">
          <DonorDataTable columns={columns} data={excludedDonors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
