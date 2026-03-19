import { type FC, useState } from "react"
import { Modal } from "@/components/modal/modal"
import type { Option } from "@/types/common"
import { useAddBlueprintToGroup } from "../../api/groups.mutations"
import { SelectGroups } from "../select-groups"

type AddBlueprintToGroupModalProps = {
  blueprintId: string
  isDropdownMenuItem?: boolean
}

export const AddBlueprintToGroupModal: FC<AddBlueprintToGroupModalProps> = ({
  blueprintId,
  isDropdownMenuItem = false,
}) => {
  const [groups, setGroups] = useState<Option[]>([])
  const addBlueprintToGroup = useAddBlueprintToGroup()

  return (
    <Modal
      title={`Add blueprint to group(s)`}
      submitBtn={{
        text: "Confirm",
        onSubmit: () =>
          addBlueprintToGroup.mutate({
            json: {
              blueprintId,
              groupIds: groups.map((group) => String(group.value)),
            },
          }),
      }}
      trigger={{
        content: "Edit groups",
      }}
      isDropdownMenuItem={isDropdownMenuItem}
    >
      <SelectGroups value={groups} setValue={setGroups} />
    </Modal>
  )
}
