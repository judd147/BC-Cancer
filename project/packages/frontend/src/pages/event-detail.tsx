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
import { DonorDataTable } from "@/components/data-table"
import { options } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useDonorStore } from "@/DonorStore";

export default function EventDetail() {
  const location = useLocation();
  const { event } = location.state;
  const { donors, setDonors } = useDonorStore();
  useEffect(() => { // set initial donors
    if (donors.length === 0 && event.donorsList) {
      const initialDonors = event.donorsList.map((donor: { status: string }) => ({
        ...donor,
        status: "preview",
      }));
      setDonors(initialDonors);
    }
  });
  const previewDonors = donors.filter((donor) => donor.status === "preview");
  const invitedDonors = donors.filter((donor) => donor.status === "invited");
  const excludedDonors = donors.filter((donor) => donor.status === "excluded");

  // useEffect(() => {
  //   const fetchDonors = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3000/events/9/donors`, {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           "Accept": "application/json",
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchDonors();
  // }, []);

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
              <p>Date: {new Date(event.date).toLocaleString("en-CA", options)}</p>
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
            <p>Address: {event.addressLine1} {event.addressLine2 && `, ${event.addressLine2}`}</p>
            <p>City: {event.city}</p>
          </div>
        </CardContent>
      </Card>
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
  )
}