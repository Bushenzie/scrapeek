import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDistance } from "date-fns"
import { Badge } from "@/components/ui/badge/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip/tooltip"
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
    cell: ({ getValue, row }) => {
      const visibleGroups = row.original?.groups.slice(0, 2)
      const extraGroups = row.original?.groups.slice(2)

      return (
        <div className="flex flex-col gap-2">
          <Link
            to="/blueprints/$blueprintId"
            params={{
              blueprintId: row.original.id,
            }}
          >
            {getValue() as string}
          </Link>
          <div className="flex gap-2 items-center">
            {visibleGroups?.map((group) => (
              <Badge variant={"outline"} key={group.id}>
                {group.name}
              </Badge>
            ))}
            {extraGroups.length !== 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={"outline"}>+{extraGroups.length}</Badge>
                </TooltipTrigger>
                <TooltipContent>{extraGroups.map((group) => group.name).join(", ")}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      )
    },
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
