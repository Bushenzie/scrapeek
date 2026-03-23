import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDistance } from "date-fns"
import { EllipsisVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemLink,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { AddBlueprintToGroupModal } from "@/features/groups/components/modals/add-blueprint-to-group"
import type { BlueprintListResponse } from "../../api/blueprints.types"
import { BlueprintListTableActions } from "./blueprint-list.actions"

export const columns: ColumnDef<BlueprintListResponse["data"][number]>[] = [
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({ getValue }) => <Badge>{(getValue() as string).toUpperCase()}</Badge>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue, row }) => (
      <div className="flex flex-col gap-2">
        <Link
          to="/blueprints/$blueprintId"
          params={{
            blueprintId: row.original.id,
          }}
        >
          {getValue() as string}
        </Link>
        {row.original?.groups?.map((group) => (
          <Badge variant={"outline"} key={group.id}>
            {group.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "result.updatedAt",
    header: "Last scrape",
    size: 150,
    cell: ({ getValue }) => (
      <>
        {formatDistance(getValue() as Date, new Date(), {
          addSuffix: true,
        }) ?? "never"}
      </>
    ),
  },
  {
    id: "actions",
    size: 100,
    header: () => (
      <span className="flex items-center w-full justify-center cursor-pointer">Actions</span>
    ),
    cell: ({ row }) => <BlueprintListTableActions blueprintId={row.original.id} />,
  },
]
