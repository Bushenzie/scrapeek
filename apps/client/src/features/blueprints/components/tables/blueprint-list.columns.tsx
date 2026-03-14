import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown/dropdown";
import type { BlueprintListResponse } from "../../api/blueprints.types";

export const columns: ColumnDef<BlueprintListResponse["data"][number]>[] = [
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({getValue}) => (<Badge>{(getValue() as string).toUpperCase()}</Badge>)
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue, row }) => (
      <Link to="/blueprints/$blueprintId" params={{
        blueprintId: row.original.id
      }}>{getValue() as string}</Link>
      ),
  },
  {
    accessorKey: "result.updatedAt",
    header: "Last scrape",
    size: 150,
    cell: ({getValue}) =>
      <>{formatDistance(getValue() as Date, new Date(), {
        addSuffix: true,
      }) ?? "never"}</>
  },
  {
    id: "actions",
    size: 100,
    header: () => <span className="flex items-center w-full justify-center cursor-pointer">Actions</span>,
    cell: () =>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center w-full justify-center cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Test 1</DropdownMenuItem>
          <DropdownMenuItem>Test 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  }
]
