import { type Group, groupInsertSchema } from "@scrapeek/db/validators"
import type { Dispatch, FC, SetStateAction } from "react"
import { Modal } from "@/components/modal/modal"
import { useAppForm } from "@/hooks/use-app-form"
import { useCreateGroup, useEditGroup } from "../../api/groups.mutations"

type EditCreateGroupModalProps = {
  group?: Group
  isDropdownMenuItem?: boolean
  state?: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
  }
}

export const EditCreateGroupModal: FC<EditCreateGroupModalProps> = ({
  group,
  isDropdownMenuItem = false,
  state,
}) => {
  const createGroup = useCreateGroup()
  const editGroup = useEditGroup()

  const form = useAppForm({
    defaultValues: {
      name: group ? group.name : "",
    },
    validators: {
      onChange: groupInsertSchema,
    },
    onSubmit: ({ value }) => {
      if (group) {
        editGroup.mutate({
          json: {
            name: value.name,
          },
          param: {
            id: group.id,
          },
        })
        return
      }
      createGroup.mutate({
        json: {
          name: value.name,
        },
      })
    },
  })

  return (
    <Modal
      title={`${group ? "Edit" : "Create"} group`}
      trigger={
        state
          ? null
          : {
              content: `${group ? "Edit" : "Create"} group`,
              props: {
                variant: "outline",
              },
            }
      }
      state={state}
      submitBtn={{
        text: group ? "Edit" : "Create",
        onSubmit: form.handleSubmit,
      }}
      isDropdownMenuItem={isDropdownMenuItem}
    >
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <form.AppField name="name" children={(field) => <field.TextField label="Name" />} />
      </form>
    </Modal>
  )
}
