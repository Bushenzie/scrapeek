import { BlueprintType } from "@scrapeek/db/constants"
import { useRouter } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Modal } from "@/components/modal/modal"
import { useAppForm } from "@/hooks/use-app-form"
import { blueprintTypeSelectSchema } from "../../schemas/blueprint-type"

export const CreateBlueprintDialog = () => {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      type: "api",
    },
    validators: {
      onChange: blueprintTypeSelectSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: Check why redirect throw does not work here
      router.navigate({
        to: "/blueprints/add",
        search: {
          type: value.type as BlueprintType,
        },
      })
    },
  })

  const options = [
    { label: "API", value: BlueprintType.API },
    { label: "Static", value: BlueprintType.Static },
    { label: "Dynamic", value: BlueprintType.Dynamic },
  ]

  return (
    <Modal
      title="Select type"
      submitBtn={{
        text: "Create",
        onSubmit: form.handleSubmit,
      }}
      trigger={{
        content: "Create",
        props: {
          icon: <Plus />,
        },
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <form.AppField
          name="type"
          children={(field) => <field.RadioGroupField label="" options={options} />}
        />
      </form>
    </Modal>
  )
}
