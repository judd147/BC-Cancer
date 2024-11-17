/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";
import { Event } from "@bc-cancer/shared/src/types/event";
import { options } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnHeader } from "./column-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "@/api/queries";

export const columns: ColumnDef<Event>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
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
    header: ({ column }) => <ColumnHeader column={column} title="City" />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const dateStr: string = row.getValue("date");
      return <div>{new Date(dateStr).toLocaleString("en-CA", options)}</div>;
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => <ColumnHeader column={column} title="Created By" />,
    cell: ({ row }) => {
      const user = row.original.createdBy;
      return <div>{user.username}</div>;
    },
  },
  {
    id: "actions",
    header: ({ table }) => {
      const queryClient = useQueryClient();
      const eventMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
          table.toggleAllPageRowsSelected(false);
        },
      });

      const handleDeleteSelected = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        selectedRows.forEach((row) => {
          eventMutation.mutate(row.original.id)
        });
      };

      const handleDeleteAll = () => {
        const allRows = table.getRowModel().rows;
        allRows.forEach((row) => {
          eventMutation.mutate(row.original.id)
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
            <DropdownMenuItem onSelect={handleDeleteSelected}>
              Delete Selected
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDeleteAll}>
              Delete All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      const navigate = useNavigate();
      const handleEditEvent = async (event: Event) => {
        navigate("/edit-event", { state: { event } });
      };

      const queryClient = useQueryClient();
      const eventMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      });
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
            <DropdownMenuItem onSelect={() => handleEditEvent(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => eventMutation.mutate(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
