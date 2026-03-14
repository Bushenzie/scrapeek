import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge/badge";
import type { BlueprintListResponse } from "../../api/blueprints.types";

export const columns: ColumnDef<BlueprintListResponse["data"][number]>[] = [
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({getValue}) => (<Badge>{(getValue() as string).toUpperCase()}</Badge>)
  },
  {
    cell: ({ getValue, row }) => (
      <Link to="/blueprints/$blueprintId" params={{
        blueprintId: row.original.id
      }}>{getValue() as string}</Link>
      ),
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "result.updatedAt",
    header: "Last scrape",
    cell: ({getValue}) =>
      <>{formatDistance(getValue() as Date, new Date(), {
        addSuffix: true,
      }) ?? "never"}</>
  }
]
