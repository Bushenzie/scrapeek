import { useQuery } from "@tanstack/react-query"
import { type FC, useState } from "react"
import { Modal } from "@/components/modal/modal"
import type { ModalProps } from "@/components/modal/modal.types"
import { blueprintDetailOptions } from "@/features/blueprints/api/blueprints.queries"
import type { Option } from "@/types/common"
import { useAddBlueprintToGroup } from "../../api/groups.mutations"
import { SelectGroups } from "../select-groups"

type AddBlueprintToGroupModalProps = Partial<ModalProps> & {
  blueprintId: string
}

export const AddBlueprintToGroupModal: FC<AddBlueprintToGroupModalProps> = ({
  blueprintId,
  isDropdownMenuItem = false,
  ...props
}) => {
  const { data: _blueprint } = useQuery(
    blueprintDetailOptions({
      param: { id: blueprintId },
    }),
  )
  const [groups, setGroups] = useState<Option[]>([])
  const addBlueprintToGroup = useAddBlueprintToGroup()

  return (
    <Modal
      {...props}
      title={`Add blueprint to group(s)`}
      submitBtn={{
        text: "Confirm",
        onSubmit: () => {
          addBlueprintToGroup.mutate({
            json: {
              blueprintId,
              groupIds: groups.map((group) => String(group)),
            },
          })
        },
      }}
      trigger={null}
    >
      <SelectGroups value={groups} setValue={setGroups} />
    </Modal>
  )
}
