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
import { CreateEventDto } from "@bc-cancer/shared/src/types/event";
import { getDonors, createEvent } from "@/api/queries";

const bcCites = [
  "Vancouver",
  "Victoria",
  "Surrey",
  "Burnaby",
  "Kelowna",
  "Nanaimo",
] as const;

// Define validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  addressLine1: z.string().min(1, { message: "Address Line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.enum(bcCites, { message: "Please select a valid city." }),
  description: z.string().optional(),
  date: z.string().datetime({ message: "Date is required" }),
  donorLimit: z
    .number()
    .min(1, { message: "Must be at least 1" })
    .max(99, { message: "Must be less than 100" }), // Limit to 1-99 donors
  eventCityOnly: z.boolean().optional(),
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
      city: undefined,
      description: "",
      date: "",
      donorLimit: undefined,
      eventCityOnly: false, // Default to not filtering by city
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
  const eventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });
  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("Form values:", values);
    try {
      // Fetch donors with query params based on user input
      const donorIds = donorsQuery.data?.map((donor) => donor.id);

      // Create the event data object following the CreateEventDto structure
      const eventData: CreateEventDto = {
        name: values.name,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        description: values.description,
        date: new Date(values.date).toISOString(),
        donorIds: donorIds || [], // Initial as 10 donors' id from the API
      };

      // Make a POST request to create the event
      eventMutation.mutate(eventData);
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
                      {bcCites.map((city) => (
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
        <FormField
          control={form.control}
          name="donorLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor Limit *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter limit (1-99)"
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

        {/* Switch for filtering by city */}
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

        {/* Submit Button */}
        <div className="space-x-4">
          <Button type="submit" className="mt-4">
            Create
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
