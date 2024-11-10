import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Event } from "../../../shared/src/types/event";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        to={`/events/${row.original.id}`}
        state={{ event: row.original }}
        className="underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
