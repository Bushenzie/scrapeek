import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { GroupListResponse } from "../../api/groups.types";



export const columns: ColumnDef<GroupListResponse["data"][number]["blueprints"][number]>[] = [
  {
    accessorKey: "name",
    cell: ({ getValue }) => <>{ getValue() as string}</>
  },
  {
    accessorKey: "createdAt",
    size: 200,
    cell: ({getValue}) => <>{format(getValue() as string, "dd.MM.yyyy / HH:mm")}</>
  }
];
