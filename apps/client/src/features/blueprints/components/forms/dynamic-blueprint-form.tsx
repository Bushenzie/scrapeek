import type { CheckedState } from "@radix-ui/react-checkbox";
import {
  BlueprintType,
  type DynamicBlueprint,
  dynamicEditableBlueprintSchema,
  type EditableDynamicBlueprint,
} from "@scrapeek/shared/blueprint";
import { formOptions } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useAppForm } from "@/hooks/use-app-form";
import { authClient } from "@/lib/clients/auth";
import { useAddBlueprint } from "../../api/mutations/use-add-blueprint";
import { useEditBlueprint } from "../../api/mutations/use-edit-blueprint";

type DynamicBlueprintFormProps = {
  blueprint?: DynamicBlueprint;
};

export const DynamicBlueprintForm: FC<DynamicBlueprintFormProps> = ({
  blueprint,
}) => {
  const [showPagination, setShowPagination] = useState(
    blueprint && blueprint?.config.pagination ? true : false
  );
  const router = useRouter();
  const { mutateAsync: addBlueprint } = useAddBlueprint();
  const { mutateAsync: editBlueprint } = useEditBlueprint();
  const { data: session } = authClient.useSession();

  if (blueprint?.result) {
    const { result, ...formattedBlueprint } = blueprint;
    blueprint = formattedBlueprint;
  }

  const defaultOptions = formOptions({
    defaultValues:
      blueprint ??
      ({
        type: BlueprintType.DYNAMIC,
        name: "",
        url: "",
        userId: session?.user?.id,
        respectRobotsTxt: true,
        config: {
          elements: [{ key: "", selector: "", attribute: undefined }],
          pagination: {},
          waitSelectorElement: "",
        },
      } as EditableDynamicBlueprint),
  });

  const form = useAppForm({
    ...defaultOptions,
    validators: {
      onChange: dynamicEditableBlueprintSchema,
    },
    onSubmit: async ({ value }) => {
      let blueprintId: string | null = null;

      if (blueprint) {
        const { data } = await editBlueprint(value);
        blueprintId = data.id;
      } else {
        const { data } = await addBlueprint(value);
        blueprintId = data.id;
      }

      if (!blueprint) return;

      await router.navigate({
        to: "/blueprints/$blueprintId",
        params: {
          blueprintId: blueprintId,
        },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePaginationChange = (checked: CheckedState) => {
    setShowPagination((prev) => !prev);
    if (checked) {
      form.setFieldValue("config.pagination", {
        variant: "link",
        selector: "",
        attribute: "",
      });
    } else {
      form.setFieldValue("config.pagination", undefined);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 col-span-1">
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Blueprint name" />}
            />

            <form.AppField
              name="url"
              children={(field) => <field.TextField label="URL" />}
            />
            <form.AppField
              name="config.waitSelectorElement"
              children={(field) => (
                <field.TextField label="Wait element selector" />
              )}
            />
            <div className="flex flex-col gap-2">
              <Label>Elements</Label>
              <form.AppField
                mode="array"
                name="config.elements"
                children={(field) => (
                  <>
                    {field.state.value.map((_, index) => (
                      <div key={index}>
                        <div className="grid grid-cols-8 gap-2">
                          <form.AppField
                            name={`config.elements[${index}].key`}
                            children={(field) => (
                              <Input
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                className="col-span-2"
                                placeholder="Key"
                              />
                            )}
                          />
                          <form.Field
                            name={`config.elements[${index}].selector`}
                            children={(field) => (
                              <Input
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                className="col-span-3"
                                placeholder="Selector"
                              />
                            )}
                          />
                          <form.Field
                            name={`config.elements[${index}].attribute`}
                            children={(field) => (
                              <Input
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(
                                    e.target.value || undefined
                                  )
                                }
                                className="col-span-2"
                                placeholder="Attribute"
                              />
                            )}
                          />
                          <Button
                            variant={"destructive"}
                            className="col-span-1 h-full"
                            onClick={() => field.removeValue(index)}
                          >
                            <XIcon />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full"
                      onClick={() => {
                        field.pushValue({ key: "", selector: "" });
                      }}
                    >
                      Add element
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
              children={(field) => (
                <field.CheckboxField label="Respect robots.txt" />
              )}
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
                  children={(field) => (
                    <field.TextField label="Pagination selector" />
                  )}
                />
                <form.Subscribe
                  selector={(state) =>
                    state.values.config.pagination?.variant === "link"
                  }
                  children={(showAttribute) => (
                    <>
                      {showAttribute && (
                        <form.AppField
                          name="config.pagination.attribute"
                          children={(field) => (
                            <field.TextField label={"Attribute"} />
                          )}
                        />
                      )}
                    </>
                  )}
                />
              </>
            )}
          </form>
        </div>
        <form.Subscribe
          selector={(state) => state.values}
          children={(state) => (
            <div className="flex flex-col gap-2">
              <Label>Config (JSON)</Label>
              <Textarea
                className="h-full"
                value={JSON.stringify(state, null, 4)}
                readOnly
              />
            </div>
          )}
        />
      </div>
      <div className="flex my-2 justify-end">
        <form.AppForm>
          <form.SubmitButton
            btnText={blueprint ? "Edit blueprint" : "Add blueprint"}
          />
        </form.AppForm>
      </div>
    </>
  );
};
