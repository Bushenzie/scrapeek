import { EllipsisVertical } from "lucide-react"
import { type FC, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemLink,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { AddBlueprintToGroupModal } from "@/features/groups/components/modals/add-blueprint-to-group"

type BlueprintListTableActionsProps = {
  blueprintId: string
}

export const BlueprintListTableActions: FC<BlueprintListTableActionsProps> = ({ blueprintId }) => {
  const [openGroupModal, setOpenGroupModal] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center w-full justify-center cursor-pointer">
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItemLink
          className="cursor-pointer"
          to="/blueprints/$blueprintId"
          params={{
            blueprintId,
          }}
        >
          View
        </DropdownMenuItemLink>
        <DropdownMenuItemLink
          className="cursor-pointer"
          to="/blueprints/$blueprintId/edit"
          params={{
            blueprintId,
          }}
        >
          Edit
        </DropdownMenuItemLink>
        <DropdownMenuItem className={"cursor-pointer"} onClick={() => setOpenGroupModal(true)}>
          Edit groups
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AddBlueprintToGroupModal
        state={{
          open: openGroupModal,
          setOpen: setOpenGroupModal,
        }}
        blueprintId={blueprintId}
      />
    </DropdownMenu>
  )
}
