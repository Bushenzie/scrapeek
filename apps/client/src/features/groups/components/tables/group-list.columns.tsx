import type { Blueprint, Group } from "@scrapeek/db/validators";
import { type ColumnDef,  } from "@tanstack/react-table";
import { format } from "date-fns";
import type { GroupListResponse } from "../../api/groups.types";



export const columns: ColumnDef<GroupListResponse["data"][number]>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => <>{ getValue() as string}</>
  },
  {
    accessorKey: "blueprints",
    header: "Blueprint count",
    size: 50,
    cell: ({getValue}) => <span className="flex items-center justify-center">{(getValue() as Blueprint[]).length}</span>
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 200,
    cell: ({getValue}) => <>{format(getValue() as string, "dd.MM.yyyy / HH:mm")}</>
  }
];
