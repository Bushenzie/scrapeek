import { BlueprintType } from "@scrapeek/db/constants"
import {
  type Blueprint,
  type EditableStaticBlueprint,
  type StaticBlueprintWithRelations,
  staticInsertBlueprintSchema,
  staticUpdateBlueprintSchema,
} from "@scrapeek/db/validators"
import { formOptions } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { XIcon } from "lucide-react"
import { type FC, useState } from "react"
import { Button } from "@/components/ui/button/button"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { useAppForm } from "@/hooks/use-app-form"
import { authClient } from "@/lib/clients/auth"
import { useCreateBlueprint, useEditBlueprint } from "../../api/blueprints.mutations"

type StaticBlueprintFormProps = {
  blueprint?: StaticBlueprintWithRelations
}

export const StaticBlueprintForm: FC<StaticBlueprintFormProps> = ({ blueprint }) => {
  const [showPagination, setShowPagination] = useState(
    blueprint && blueprint?.config?.pagination ? true : false,
  )

  const router = useRouter()
  const { mutateAsync: addBlueprint } = useCreateBlueprint()
  const { mutateAsync: editBlueprint } = useEditBlueprint()
  const { data: session } = authClient.useSession()

  if (blueprint?.result) {
    const { result, ...formattedBlueprint } = blueprint
    blueprint = formattedBlueprint
  }

  const defaultOptions = formOptions({
    defaultValues:
      blueprint ??
      ({
        type: BlueprintType.Static,
        name: "",
        description: "",
        url: "",
        respectRobotsTxt: true,
        public: false,
        userId: session?.user?.id,
        config: {
          timeout: 0,
          elements: [
            {
              key: "",
              container: {
                selector: "",
                elements: [],
              },
            },
          ],
        },
      } as EditableStaticBlueprint),
  })

  const form = useAppForm({
    ...defaultOptions,
    validators: {
      onChange: blueprint ? staticUpdateBlueprintSchema : staticInsertBlueprintSchema,
    },
    onSubmit: async ({ value }) => {
      let blueprintId: string | null = null

      if (blueprint) {
        const response = await editBlueprint({ json: value, param: { id: blueprint.id } })
        const data = await response.json()
        blueprintId = data.data.id
      } else {
        const response = await addBlueprint({ json: value as Blueprint })
        const data = await response.json()
        blueprintId = data.data.id
      }

      await router.navigate({
        to: "/blueprints/$blueprintId",
        params: {
          blueprintId: blueprintId,
        },
      })
    },
  })

  const handlePaginationChange = (checked: boolean) => {
    setShowPagination((prev) => !prev)
    if (checked) {
      form.setFieldValue("config.pagination", {
        variant: "link",
        selector: "",
        attribute: "",
      })
    } else {
      form.setFieldValue("config.pagination", undefined)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <>
      <div className="gap-2">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 col-span-1">
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Blueprint name" />}
            />
            <form.AppField
              name="description"
              children={(field) => <field.TextareaField label="Blueprint description" />}
            />
            <form.AppField
              name="config.timeout"
              children={(field) => <field.NumberField label="Timeout (ms)" />}
            />
            <form.AppField name="url" children={(field) => <field.TextField label="URL" />} />
            <div className="flex flex-col gap-2">
              <Label>Containers</Label>
              <form.AppField
                mode="array"
                name="config.elements"
                children={(containersField) => (
                  <>
                    {containersField?.state?.value?.map((_, containerIndex) => (
                      <div
                        key={containerIndex}
                        className="flex flex-col border border-blueprint-400 p-4 gap-2"
                      >
                        <div className="grid grid-cols-8 gap-2">
                          <form.AppField
                            name={`config.elements[${containerIndex}].key`}
                            children={(field) => (
                              <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="col-span-3"
                                placeholder="Container key"
                              />
                            )}
                          />
                          <form.AppField
                            name={`config.elements[${containerIndex}].container.selector`}
                            children={(field) => (
                              <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="col-span-4"
                                placeholder="Container selector"
                              />
                            )}
                          />
                          <Button
                            variant={"destructive"}
                            className="col-span-1 h-full"
                            onClick={() => containersField.removeValue(containerIndex)}
                          >
                            <XIcon />
                          </Button>
                        </div>

                        <div className="flex flex-col gap-2 pl-4 py-2">
                          <Label>Elements</Label>
                          <form.AppField
                            mode="array"
                            name={`config.elements[${containerIndex}].container.elements`}
                            children={(elementsField) => (
                              <>
                                {elementsField?.state?.value?.map((_, elementIndex) => (
                                  <div key={elementIndex} className="grid grid-cols-8 gap-2">
                                    <form.AppField
                                      name={`config.elements[${containerIndex}].container.elements[${elementIndex}].key`}
                                      children={(field) => (
                                        <Input
                                          value={field.state.value}
                                          onChange={(e) => field.handleChange(e.target.value)}
                                          className="col-span-2"
                                          placeholder="Key"
                                        />
                                      )}
                                    />
                                    <form.AppField
                                      name={`config.elements[${containerIndex}].container.elements[${elementIndex}].selector`}
                                      children={(field) => (
                                        <Input
                                          value={field.state.value}
                                          onChange={(e) => field.handleChange(e.target.value)}
                                          className="col-span-3"
                                          placeholder="Selector"
                                        />
                                      )}
                                    />
                                    <form.AppField
                                      name={`config.elements[${containerIndex}].container.elements[${elementIndex}].attribute`}
                                      children={(field) => (
                                        <Input
                                          value={field.state.value ?? ""}
                                          onChange={(e) =>
                                            field.handleChange(e.target.value || undefined)
                                          }
                                          className="col-span-2"
                                          placeholder="Attribute"
                                        />
                                      )}
                                    />
                                    <Button
                                      variant={"destructive"}
                                      className="col-span-1 h-full"
                                      onClick={() => elementsField.removeValue(elementIndex)}
                                    >
                                      <XIcon />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  className="w-full"
                                  onClick={() =>
                                    elementsField.pushValue({
                                      key: "",
                                      selector: "",
                                      attribute: undefined,
                                    })
                                  }
                                >
                                  Add element
                                </Button>
                              </>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full"
                      onClick={() =>
                        containersField.pushValue({
                          key: "",
                          container: { selector: "", elements: [] },
                        })
                      }
                    >
                      Add container
                    </Button>
                  </>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Checkbox
                id="pagination"
                checked={showPagination}
                onCheckedChange={handlePaginationChange}
              />
              <Label htmlFor="pagination">Include pagination</Label>
            </div>
            <form.AppField
              name="respectRobotsTxt"
              children={(field) => <field.CheckboxField label="Respect robots.txt" />}
            />
            <form.AppField
              name="public"
              children={(field) => <field.CheckboxField label="Public" />}
            />
            {showPagination && (
              <>
                <form.AppField
                  name="config.pagination.variant"
                  children={(field) => (
                    <field.SelectField
                      label="Pagination variant"
                      triggerLabel=""
                      options={[
                        { label: "Link", value: "link" },
                        { label: "Button", value: "button" },
                      ]}
                    />
                  )}
                />
                <form.AppField
                  name="config.pagination.selector"
                  children={(field) => <field.TextField label="Pagination selector" />}
                />
                <form.Subscribe
                  selector={(state) => state?.values?.config?.pagination?.variant === "link"}
                  children={(showAttribute) => (
                    <>
                      {showAttribute && (
                        <form.AppField
                          name="config.pagination.attribute"
                          children={(field) => <field.TextField label={"Attribute"} />}
                        />
                      )}
                    </>
                  )}
                />
              </>
            )}
          </form>
        </div>
        {/*<form.Subscribe
          selector={(state) => state.values}
          children={(state) => (
            <div className="flex flex-col gap-2">
              <Label>Config (JSON)</Label>
              <Textarea className="h-full" value={JSON.stringify(state, null, 4)} readOnly />
            </div>
          )}
        />*/}
      </div>
      <div className="flex my-2 justify-end">
        <form.AppForm>
          <form.SubmitButton btnText={blueprint ? "Edit blueprint" : "Add blueprint"} />
        </form.AppForm>
      </div>
    </>
  )
}
