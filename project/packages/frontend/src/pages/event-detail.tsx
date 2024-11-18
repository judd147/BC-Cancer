import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
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
import { UserAvatar } from "@/components/user-avatar";
import { options } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getEventDonors } from "@/api/queries";
import { Button } from "@/components/ui/button";

export default function EventDetail() {
  const navigate = useNavigate();
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

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Event Title and User Avatar*/}
      <div className="relative flex items-center">
        <Button onClick={() => navigate("/events")}>Back</Button>
        <h1 className="text-4xl font-bold text-center w-full">{event.name}</h1>
        <div className="absolute right-0">
          <UserAvatar />
        </div>
      </div>

      {/* Event Details, Location, and Change History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Event Details and Location */}
        <div className="space-y-4">
          {/* Event Details Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Date: {new Date(event.date).toLocaleString("en-CA", options)}
                </p>
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
        </div>

        {/* Right Column: Change History Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Change History</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[250px]">
            <ChangeHistoryScroll
              eventId={event.id}
              donors={[...previewDonors, ...invitedDonors, ...excludedDonors]}
            />
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Tabs for Donors List */}
      <Tabs defaultValue="preview">
        <TabsList className="grid grid-cols-3 w-1/3">
          <TabsTrigger value="preview">
            Preview ({previewDonors.length})
          </TabsTrigger>
          <TabsTrigger value="invited">
            Invited ({invitedDonors.length})
          </TabsTrigger>
          <TabsTrigger value="excluded">
            Excluded ({excludedDonors.length})
          </TabsTrigger>
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
