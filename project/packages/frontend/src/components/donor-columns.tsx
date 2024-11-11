import { ColumnDef } from "@tanstack/react-table";
import { Donor } from "../../../shared/src/types/donor";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export const columns: ColumnDef<Donor>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: "totalDonations",
    header: "Total Donations",
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
    header: "Total Pledge",
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
    header: "Largest Gift",
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
    header: "First Gift Date",
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
    header: "Last Gift Date",
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
    header: "Last Gift Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("lastGiftAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
];
