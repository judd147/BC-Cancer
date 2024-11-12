import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CreateEventDto } from "@bc-cancer/shared/src/types/event";
import { Donor } from "@bc-cancer/shared/src/types/donor";

// Define validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  addressLine1: z.string().min(1, { message: "Address Line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  description: z.string().optional(),
  date: z
    .string()
    .datetime({ message: "Date is required" }),
});

export function EventForm() {
  const navigate = useNavigate();

  // Initialize the form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      description: "",
      date: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // log the form values
    // console.log("Form values:", values);

    // Send the event data to the API
    try {
      // Fetch all donors and retrieve their IDs
      const donorResponse = await axios.get<Donor[]>("http://localhost:3000/donors", {
        withCredentials: true,
      });
      const donorIds = donorResponse.data.map((donor) => donor.id);

      // Create the event data object following the CreateEventDto structure
      const eventData: CreateEventDto = {
        name: values.name,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        description: values.description,
        date: new Date(values.date).toISOString(), 
        donorsList: donorIds, // Initial as 10 donors' id from the API
        excludedDonors: [], // Initial as empty array
      };

      // Make a POST request to create the event
      await axios.post("http://localhost:3000/events", eventData, {
        withCredentials: true, 
      });
      console.log("Event created successfully:", eventData);
      navigate("/events"); // Navigate to the events page after successful creation
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name *</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the event"
                  {...field}
                  className="h-24 resize-y" // Allows resizing vertically
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            const dateValue = field.value ? parseISO(field.value) : undefined;
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(parseISO(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Address Line 1 field */}
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1 *</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Line 2 field (optional) */}
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Apt 4B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City field */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" className="mt-4">
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  );
}