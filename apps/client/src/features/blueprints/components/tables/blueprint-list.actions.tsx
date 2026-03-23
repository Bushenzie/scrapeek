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
        <AddBlueprintToGroupModal blueprintId={blueprintId} isDropdownMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
