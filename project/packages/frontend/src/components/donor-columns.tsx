import { ColumnDef } from "@tanstack/react-table";
import { Donor } from "../../../shared/src/types/donor";

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
  },
  {
    accessorKey: "totalPledge",
    header: "Total Pledge",
  },
  {
    accessorKey: "largestGift",
    header: "Largest Gift",
  },
];
