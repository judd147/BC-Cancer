/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { Donor } from "@bc-cancer/shared/src/types/donor";
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { options } from "@/lib/utils";
import { ColumnHeader } from "./column-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editEventDonors } from "@/api/queries";

export const createColumns = (eventId: number): ColumnDef<Donor>[] => {
  return [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <ColumnHeader column={column} title="City" />
    ),
  },
  {
    accessorKey: "totalDonations",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Total Donations" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalDonations"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "totalPledge",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Total Pledge" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPledge"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "largestGift",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Largest Gift" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("largestGift"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "firstGiftDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="First Gift Date" />
    ),
    cell: ({ row }) => {
      const dateStr: string = row.getValue("firstGiftDate");
      return (
        <div>
          {new Date(dateStr).toLocaleString("en-CA", options)}
        </div>
      );
    },
  },
  {
    accessorKey: "lastGiftDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Last Gift Date" />
    ),
    cell: ({ row }) => {
      const dateStr: string = row.getValue("lastGiftDate");
      return (
        <div>
          {new Date(dateStr).toLocaleString("en-CA", options)}
        </div>
      );
    },
  },
  {
    accessorKey: "lastGiftAmount",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Last Gift Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("lastGiftAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "addressLine1",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Address Line 1" />
    ),
  },
  {
    accessorKey: "addressLine2",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Address Line 2" />
    ),
  },
  {
    accessorKey: "contactPhoneType",
    header: ({ column }) => <ColumnHeader column={column} title="Contact Phone Type" />,
  },
  {
    accessorKey: "phoneRestrictions",
    header: ({ column }) => <ColumnHeader column={column} title="Phone Restrictions" />,
  },
  {
    accessorKey: "emailRestrictions",
    header: ({ column }) => <ColumnHeader column={column} title="Email Restrictions" />,
  },
  {
    accessorKey: "communicationRestrictions",
    header: ({ column }) => <ColumnHeader column={column} title="Communication Restrictions" />,
  },
  {
    accessorKey: "subscriptionEventsInPerson",
    header: ({ column }) => <ColumnHeader column={column} title="Subscription Events In Person" />,
  },
  {
    accessorKey: "subscriptionEventsMagazine",
    header: ({ column }) => <ColumnHeader column={column} title="Subscription Events Magazine" />,
  },
  {
    accessorKey: "communicationPreference",
    header: ({ column }) => <ColumnHeader column={column} title="Communication Preference" />,
  },
  { 
    id: "actions",
    header: ({ table }) => {
      const queryClient = useQueryClient();
      const eventDonorMutation = useMutation({
        mutationFn: editEventDonors,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["donors", eventId] });
          queryClient.invalidateQueries({ queryKey: ["eventHistory", eventId] }); // Invalidate change history query
          table.toggleAllPageRowsSelected(false);
        },
      });

      const handleInviteSelected = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const donorIds: number[] = [];
        selectedRows.forEach((row) => {
          donorIds.push(row.original.id);
        });
        eventDonorMutation.mutate({
          eventId,
          donorIds: donorIds,
          newStatus: "invited",
        });
      };

      const handleExcludeSelected = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const donorIds: number[] = [];
        selectedRows.forEach((row) => {
          donorIds.push(row.original.id);
        });
        eventDonorMutation.mutate({
          eventId,
          donorIds: donorIds,
          newStatus: "excluded",
        });
      };

      const handleInviteAll = () => {
        const allRows = table.getRowModel().rows;
        const donorIds: number[] = [];
        allRows.forEach((row) => {
          donorIds.push(row.original.id);
        });
        eventDonorMutation.mutate({
          eventId,
          donorIds: donorIds,
          newStatus: "invited",
        });
      };

      const handleExcludeAll = () => {
        const allRows = table.getRowModel().rows;
        const donorIds: number[] = [];
        allRows.forEach((row) => {
          donorIds.push(row.original.id);
        });
        eventDonorMutation.mutate({
          eventId,
          donorIds: donorIds,
          newStatus: "excluded",
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleInviteSelected}>
              Invite Selected
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExcludeSelected}>
              Exclude Selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleInviteAll}>
              Invite All
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExcludeAll}>
              Exclude All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      const donor = row.original
      const queryClient = useQueryClient();
      const eventDonorMutation = useMutation({
        mutationFn: editEventDonors,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["donors", eventId] });
          queryClient.invalidateQueries({ queryKey: ["eventHistory", eventId] }); // Invalidate change history query
        },
      });

      const handleInvite = () => {
        eventDonorMutation.mutate({
          eventId,
          donorIds: [donor.id],
          newStatus: "invited",
        });
      };

      const handleExclude = () => {
        eventDonorMutation.mutate({
          eventId,
          donorIds: [donor.id],
          newStatus: "excluded",
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(donor.firstName+" "+donor.lastName)}
            >
              Copy donor name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleInvite}>
              Invite
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExclude}>
              Exclude
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
];
}