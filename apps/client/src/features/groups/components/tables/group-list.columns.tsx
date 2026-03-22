import type { Blueprint, Group } from "@scrapeek/db/validators"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { EllipsisVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown"
import type { GroupListResponse } from "../../api/groups.types"
import { DeleteGroupModal } from "../modals/delete-group.modal"
import { EditCreateGroupModal } from "../modals/edit-create-group-modal"

export const columns: ColumnDef<GroupListResponse["data"][number]>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => <>{getValue() as string}</>,
  },
  {
    accessorKey: "blueprints",
    header: "Blueprint count",
    size: 50,
    cell: ({ getValue }) => (
      <span className="flex items-center justify-center">{(getValue() as Blueprint[]).length}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 200,
    cell: ({ getValue }) => <>{format(getValue() as string, "dd.MM.yyyy / HH:mm")}</>,
  },
  {
    id: "actions",
    size: 100,
    header: () => (
      <span className="flex items-center w-full justify-center cursor-pointer">Actions</span>
    ),
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center w-full justify-center cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <EditCreateGroupModal group={row.original} isDropdownMenuItem />
          <DeleteGroupModal groupId={row.original.id} isDropdownMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
