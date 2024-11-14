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
import { useDonorStore } from "@/DonorStore";

export const columns: ColumnDef<Donor>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      const donor = row.original
      const { updateDonorStatus } = useDonorStore();
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
            <DropdownMenuItem onSelect={() => updateDonorStatus(donor.id, "invited")}>
              Invite
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => updateDonorStatus(donor.id, "excluded")}>
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
