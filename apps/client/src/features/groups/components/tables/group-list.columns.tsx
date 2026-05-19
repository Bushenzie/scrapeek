import type { Blueprint } from "@scrapeek/db/validators"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { EllipsisVertical } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import type { GroupListResponse } from "../../api/groups.types"
import { DeleteGroupModal } from "../modals/delete-group.modal"
import { EditCreateGroupModal } from "../modals/edit-create-group-modal"

const GroupActionsCell = ({ group }: { group: GroupListResponse["data"][number] }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center w-full justify-center cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit group</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>Delete group</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCreateGroupModal group={group} state={{ open: editOpen, setOpen: setEditOpen }} />
      <DeleteGroupModal groupId={group.id} state={{ open: deleteOpen, setOpen: setDeleteOpen }} />
    </>
  )
}

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
    cell: ({ row }) => <GroupActionsCell group={row.original} />,
  },
]
