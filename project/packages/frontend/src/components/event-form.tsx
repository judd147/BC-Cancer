import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
} from "@bc-cancer/shared/src/types/event";
import { getDonors, createEvent, updateEvent } from "@/api/queries";
import { useMemo } from "react";

const bcCities = [
  "Abbotsford",
  "Armstrong",
  "Burnaby",
  "Campbell River",
  "Castlegar",
  "Chilliwack",
  "Colwood",
  "Coquitlam",
  "Courtenay",
  "Cranbrook",
  "Dawson Creek",
  "Delta",
  "Duncan",
  "Enderby",
  "Fernie",
  "Fort St. John",
  "Grand Forks",
  "Greenwood",
  "Kamloops",
  "Kelowna",
  "Kimberley",
  "Langford",
  "Langley",
  "Maple Ridge",
  "Merritt",
  "Mission",
  "Nanaimo",
  "Nelson",
  "New Westminster",
  "North Vancouver",
  "Parksville",
  "Penticton",
  "Pitt Meadows",
  "Port Alberni",
  "Port Coquitlam",
  "Port Moody",
  "Powell River",
  "Prince George",
  "Prince Rupert",
  "Quesnel",
  "Revelstoke",
  "Richmond",
  "Rossland",
  "Salmon Arm",
  "Surrey",
  "Terrace",
  "Trail",
  "Vancouver",
  "Vernon",
  "Victoria",
  "West Kelowna",
  "White Rock",
  "Williams Lake"
] as const;

// Define validation schema
const baseFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  addressLine1: z.string().min(1, { message: "Address Line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.enum(bcCities, { message: "Please select a valid city." }),
  description: z.string().optional(),
  date: z.string().datetime({ message: "Date is required" }),
  donorLimit: z
    .number()
    .min(1, { message: "Must be at least 1" })
    .max(99, { message: "Must be less than 100" }), // Limit to 1-99 donors
  eventCityOnly: z.boolean().optional(),
});

export function EventForm({ event }: { event?: Event }) {
  const navigate = useNavigate();
  // Modify schema for editing
  const formSchema = useMemo(() => {
    if (event) {
      return baseFormSchema.extend({
        donorLimit: z
          .number()
          .min(1, { message: "Must be at least 1" })
          .max(99, { message: "Must be less than 100" })
          .optional(),
      });
    }
    return baseFormSchema;
  }, [event]);
  // Initialize the form with schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name || "",
      addressLine1: event?.addressLine1 || "",
      addressLine2: event?.addressLine2 || "",
      city: (event?.city as (typeof bcCities)[number]) || undefined,
      description: event?.description || "",
      date: event?.date ? new Date(event.date).toISOString() : "",
      donorLimit: undefined,
      eventCityOnly: false,
    },
  });
  const donorQueryParams = {
    limit: form.watch("donorLimit"),
    ...(form.watch("eventCityOnly") && { city: form.watch("city") }),
  };
  // define react query/mutation
  const queryClient = useQueryClient();
  const donorsQuery = useQuery({
    queryKey: ["donors", donorQueryParams],
    queryFn: () => getDonors(donorQueryParams),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // collect donor IDs
      const donorIds = donorsQuery.data?.map((donor) => donor.id);
      // prepare event data
      const eventData: CreateEventDto = {
        name: values.name,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        description: values.description,
        date: new Date(values.date).toISOString(),
        donorIds: donorIds || [],
      };
      createEventMutation.mutate(eventData); // request to create the event
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  }

  async function onUpdate(values: z.infer<typeof formSchema>) {
    try {
      // prepare event data
      const eventData: UpdateEventDto = {
        name: values.name,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        description: values.description,
        date: new Date(values.date).toISOString(),
      };
      if (event) {
        updateEventMutation.mutate({ eventId: event.id, event: eventData }); // request to update the event
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          event ? form.handleSubmit(onUpdate) : form.handleSubmit(onSubmit)
        }
        className="space-y-8"
      >
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
                          !field.value && "text-muted-foreground",
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
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
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

        {/* City field as Select */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cities</SelectLabel>
                      {bcCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Donor Limit field */}
        {!event && (
          <FormField
            control={form.control}
            name="donorLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donor Limit *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={
                      event
                        ? "Enter a new value (1-99) to refetch donors"
                        : "Enter limit (1-99)"
                    }
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Switch for filtering by city */}
        {!event && (
          <FormField
            control={form.control}
            name="eventCityOnly"
            render={({ field }) => (
              <FormItem className="flex place-items-center space-x-4">
                <FormLabel className="mr-2">
                  Invite Donors from Event City Only
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="!m-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <div className="space-x-4">
          <Button type="submit" className="mt-4">
            {event ? "Update" : "Create"}
          </Button>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/events")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
