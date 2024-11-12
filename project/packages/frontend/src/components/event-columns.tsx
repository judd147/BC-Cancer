import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Event } from "@bc-cancer/shared/src/types/event";
import { options } from "@/lib/utils";

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
    cell: ({ row }) => {
      const dateStr: string = row.getValue("date");
      return (
        <div>
          {new Date(dateStr).toLocaleString("en-CA", options)}
        </div>
      );
    },
  },
];
