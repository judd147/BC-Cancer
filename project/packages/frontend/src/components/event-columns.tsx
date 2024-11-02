import { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Event = {
  id: number
  name: string
  location: string
  date: string
}

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link to={`/events/${row.original.id}`} className="hover:underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
]
