import { BlueprintType } from "@scrapeek/db/constants"
import {
  type Blueprint,
  type DynamicBlueprintWithRelations,
  dynamicInsertBlueprintSchema,
  dynamicUpdateBlueprintSchema,
  type EditableDynamicBlueprint,
} from "@scrapeek/db/validators"
import { formOptions } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { XIcon } from "lucide-react"
import { type FC, useState } from "react"
import { Button } from "@/components/ui/button/button"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Label } from "@/components/ui/label/label"
import { useAppForm } from "@/hooks/use-app-form"
import { authClient } from "@/lib/clients/auth"
import { useCreateBlueprint, useEditBlueprint } from "../../api/blueprints.mutations"

type DynamicBlueprintFormProps = {
  blueprint?: DynamicBlueprintWithRelations
}

export const DynamicBlueprintForm: FC<DynamicBlueprintFormProps> = ({ blueprint }) => {
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
        type: BlueprintType.Dynamic,
        name: "",
        description: "",
        url: "",
        respectRobotsTxt: true,
        public: false,
        userId: session?.user?.id,
        config: {
          timeout: 0,
          waitSelectorElement: "",
          elements: [
            {
              key: "",
              container: {
                selector: "",
                elements: [
                  {
                    key: "",
                    selector: "",
                    type: "string",
                    attribute: "",
                  },
                ],
              },
            },
          ],
        },
      } as EditableDynamicBlueprint),
  })

  const form = useAppForm({
    ...defaultOptions,
    validators: {
      onChange: blueprint ? dynamicUpdateBlueprintSchema : dynamicInsertBlueprintSchema,
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
            <form.AppField
              name="config.waitSelectorElement"
              children={(field) => <field.TextField label="Wait element selector" />}
            />
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
                        <div className="grid grid-cols-8 gap-2 items-end">
                          <div className="col-span-2">
                            <form.AppField
                              name={`config.elements[${containerIndex}].key`}
                              children={(field) => (
                                <field.TextField label="Key" showError={false} />
                              )}
                            />
                          </div>
                          <div className="col-span-4">
                            <form.AppField
                              name={`config.elements[${containerIndex}].container.selector`}
                              children={(field) => (
                                <field.TextField label="Selector" showError={false} />
                              )}
                            />
                          </div>
                          <Button
                            variant={"destructive"}
                            className="col-span-1"
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
                                  <div key={elementIndex} className="flex flex-col gap-2">
                                    <div className="grid grid-cols-10 gap-2 items-end">
                                      <div className="col-span-2">
                                        <form.AppField
                                          name={`config.elements[${containerIndex}].container.elements[${elementIndex}].key`}
                                          children={(field) => (
                                            <field.TextField label="Key" showError={false} />
                                          )}
                                        />
                                      </div>
                                      <div className="col-span-3">
                                        <form.AppField
                                          name={`config.elements[${containerIndex}].container.elements[${elementIndex}].selector`}
                                          children={(field) => (
                                            <field.TextField label="Selector" showError={false} />
                                          )}
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <form.AppField
                                          name={`config.elements[${containerIndex}].container.elements[${elementIndex}].attribute`}
                                          children={(field) => (
                                            <field.TextField label="Attribute" showError={false} />
                                          )}
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <form.AppField
                                          name={`config.elements[${containerIndex}].container.elements[${elementIndex}].type`}
                                          listeners={{
                                            onChange: ({ value }) => {
                                              const path =
                                                `config.elements[${containerIndex}].container.elements[${elementIndex}].condition` as const
                                              if (value === "boolean") {
                                                form.setFieldValue(path, {
                                                  operation: "equals",
                                                  to: "",
                                                })
                                              } else {
                                                form.setFieldValue(path, undefined as never)
                                              }
                                            },
                                          }}
                                          children={(field) => (
                                            <field.SelectField
                                              label="Datatype"
                                              triggerLabel="Datatype"
                                              showError={false}
                                              options={[
                                                { label: "String", value: "string" },
                                                { label: "Number", value: "number" },
                                                { label: "Boolean", value: "boolean" },
                                              ]}
                                            />
                                          )}
                                        />
                                      </div>
                                      <Button
                                        variant={"destructive"}
                                        className="col-span-1"
                                        onClick={() => elementsField.removeValue(elementIndex)}
                                      >
                                        <XIcon />
                                      </Button>
                                    </div>
                                    <form.Subscribe
                                      selector={(state) =>
                                        state?.values?.config?.elements?.[containerIndex]?.container
                                          ?.elements?.[elementIndex]?.type === "boolean"
                                      }
                                      children={(isBoolean) =>
                                        isBoolean ? (
                                          <div className="grid grid-cols-10 gap-2 items-end pl-8">
                                            <div className="col-span-4">
                                              <form.AppField
                                                name={`config.elements[${containerIndex}].container.elements[${elementIndex}].condition.operation`}
                                                children={(field) => (
                                                  <field.SelectField
                                                    label="Operation"
                                                    triggerLabel="Operation"
                                                    showError={false}
                                                    options={[
                                                      { label: "Equals", value: "equals" },
                                                      { label: "Not equals", value: "notEquals" },
                                                    ]}
                                                  />
                                                )}
                                              />
                                            </div>
                                            <div className="col-span-5">
                                              <form.AppField
                                                name={`config.elements[${containerIndex}].container.elements[${elementIndex}].condition.to`}
                                                children={(field) => (
                                                  <field.TextField
                                                    label="Compare to"
                                                    showError={false}
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                        ) : null
                                      }
                                    />
                                    <form.Subscribe
                                      selector={(state) =>
                                        state?.values?.config?.elements?.[containerIndex]?.container
                                          ?.elements?.[elementIndex]?.type === "string"
                                      }
                                      children={(isString) =>
                                        isString ? (
                                          <div className="grid grid-cols-10 gap-2 items-end pl-6">
                                            <div className="col-span-4">
                                              <form.AppField
                                                name={`config.elements[${containerIndex}].container.elements[${elementIndex}].removeNewLines`}
                                                children={(field) => (
                                                  <field.CheckboxField
                                                    label="Remove new lines"
                                                    showError={false}
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                        ) : null
                                      }
                                    />
                                    <form.Subscribe
                                      selector={(state) =>
                                        state?.values?.config?.elements?.[containerIndex]?.container
                                          ?.elements?.[elementIndex]?.crawl
                                      }
                                      children={(crawl) =>
                                        crawl === undefined ? (
                                          <div className="pl-8">
                                            <Button
                                              onClick={() =>
                                                form.setFieldValue(
                                                  `config.elements[${containerIndex}].container.elements[${elementIndex}].crawl`,
                                                  [
                                                    {
                                                      key: "",
                                                      selector: "",
                                                      attribute: undefined,
                                                      type: "string",
                                                      removeNewLines: true,
                                                    },
                                                  ],
                                                )
                                              }
                                            >
                                              Enable crawl
                                            </Button>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col gap-2 pl-8 py-2 border-l border-blueprint-400">
                                            <div className="flex items-center justify-between">
                                              <Label>Crawl fields</Label>
                                              <Button
                                                variant="destructive"
                                                onClick={() =>
                                                  form.setFieldValue(
                                                    `config.elements[${containerIndex}].container.elements[${elementIndex}].crawl`,
                                                    undefined as never,
                                                  )
                                                }
                                              >
                                                Disable crawl
                                              </Button>
                                            </div>
                                            <form.AppField
                                              mode="array"
                                              name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl`}
                                              children={(crawlField) => (
                                                <>
                                                  {crawlField?.state?.value?.map(
                                                    (_, crawlIndex) => (
                                                      <div
                                                        key={crawlIndex}
                                                        className="flex flex-col gap-2"
                                                      >
                                                        <div className="grid grid-cols-12 gap-2 items-end">
                                                          <div className="col-span-2">
                                                            <form.AppField
                                                              name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].key`}
                                                              children={(field) => (
                                                                <field.TextField
                                                                  label="Key"
                                                                  showError={false}
                                                                />
                                                              )}
                                                            />
                                                          </div>
                                                          <div className="col-span-3">
                                                            <form.AppField
                                                              name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].selector`}
                                                              children={(field) => (
                                                                <field.TextField
                                                                  label="Selector"
                                                                  showError={false}
                                                                />
                                                              )}
                                                            />
                                                          </div>
                                                          <div className="col-span-2">
                                                            <form.AppField
                                                              name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].attribute`}
                                                              children={(field) => (
                                                                <field.TextField
                                                                  label="Attribute"
                                                                  showError={false}
                                                                />
                                                              )}
                                                            />
                                                          </div>
                                                          <div className="col-span-4">
                                                            <form.AppField
                                                              name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].type`}
                                                              listeners={{
                                                                onChange: ({ value }) => {
                                                                  const path =
                                                                    `config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].condition` as const
                                                                  if (value === "boolean") {
                                                                    form.setFieldValue(path, {
                                                                      operation: "equals",
                                                                      to: "",
                                                                    })
                                                                  } else {
                                                                    form.setFieldValue(
                                                                      path,
                                                                      undefined as never,
                                                                    )
                                                                  }
                                                                },
                                                              }}
                                                              children={(field) => (
                                                                <field.SelectField
                                                                  label="Datatype"
                                                                  triggerLabel="Datatype"
                                                                  showError={false}
                                                                  options={[
                                                                    {
                                                                      label: "String",
                                                                      value: "string",
                                                                    },
                                                                    {
                                                                      label: "Number",
                                                                      value: "number",
                                                                    },
                                                                    {
                                                                      label: "Boolean",
                                                                      value: "boolean",
                                                                    },
                                                                  ]}
                                                                />
                                                              )}
                                                            />
                                                          </div>
                                                          <Button
                                                            variant="destructive"
                                                            className="col-span-1"
                                                            onClick={() =>
                                                              crawlField.removeValue(crawlIndex)
                                                            }
                                                          >
                                                            <XIcon />
                                                          </Button>
                                                        </div>
                                                        <form.Subscribe
                                                          selector={(state) =>
                                                            state?.values?.config?.elements?.[
                                                              containerIndex
                                                            ]?.container?.elements?.[elementIndex]
                                                              ?.crawl?.[crawlIndex]?.type ===
                                                            "boolean"
                                                          }
                                                          children={(isBoolean) =>
                                                            isBoolean ? (
                                                              <div className="grid grid-cols-12 gap-2 items-end pl-8">
                                                                <div className="col-span-5">
                                                                  <form.AppField
                                                                    name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].condition.operation`}
                                                                    children={(field) => (
                                                                      <field.SelectField
                                                                        label="Operation"
                                                                        triggerLabel="Operation"
                                                                        showError={false}
                                                                        options={[
                                                                          {
                                                                            label: "Equals",
                                                                            value: "equals",
                                                                          },
                                                                          {
                                                                            label: "Not equals",
                                                                            value: "notEquals",
                                                                          },
                                                                        ]}
                                                                      />
                                                                    )}
                                                                  />
                                                                </div>
                                                                <div className="col-span-6">
                                                                  <form.AppField
                                                                    name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].condition.to`}
                                                                    children={(field) => (
                                                                      <field.TextField
                                                                        label="Compare to"
                                                                        showError={false}
                                                                      />
                                                                    )}
                                                                  />
                                                                </div>
                                                              </div>
                                                            ) : null
                                                          }
                                                        />
                                                        <form.Subscribe
                                                          selector={(state) =>
                                                            state?.values?.config?.elements?.[
                                                              containerIndex
                                                            ]?.container?.elements?.[elementIndex]
                                                              ?.crawl?.[crawlIndex]?.type ===
                                                            "string"
                                                          }
                                                          children={(isString) =>
                                                            isString ? (
                                                              <div className="grid grid-cols-12 gap-2 items-end pl-6">
                                                                <div className="col-span-5">
                                                                  <form.AppField
                                                                    name={`config.elements[${containerIndex}].container.elements[${elementIndex}].crawl[${crawlIndex}].removeNewLines`}
                                                                    children={(field) => (
                                                                      <field.CheckboxField
                                                                        label="Remove new lines"
                                                                        showError={false}
                                                                      />
                                                                    )}
                                                                  />
                                                                </div>
                                                              </div>
                                                            ) : null
                                                          }
                                                        />
                                                      </div>
                                                    ),
                                                  )}
                                                  <Button
                                                    className="w-full"
                                                    onClick={() =>
                                                      crawlField.pushValue({
                                                        key: "",
                                                        selector: "",
                                                        attribute: undefined,
                                                        type: "string",
                                                        removeNewLines: true,
                                                      })
                                                    }
                                                  >
                                                    Add crawl field
                                                  </Button>
                                                </>
                                              )}
                                            />
                                          </div>
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                                <Button
                                  className="w-full"
                                  onClick={() =>
                                    elementsField.pushValue({
                                      key: "",
                                      selector: "",
                                      attribute: undefined,
                                      type: "string",
                                      removeNewLines: true,
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
      </div>
      <div className="flex my-2 justify-end">
        <form.AppForm>
          <form.SubmitButton btnText={blueprint ? "Edit blueprint" : "Add blueprint"} />
        </form.AppForm>
      </div>
    </>
  )
}
