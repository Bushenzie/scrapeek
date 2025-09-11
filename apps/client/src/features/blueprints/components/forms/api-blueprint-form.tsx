import type { CheckedState } from "@radix-ui/react-checkbox";
import {
  apiEditableBlueprintSchema,
  BlueprintType,
  type EditableAPIBlueprint,
} from "@scrapeek/shared/blueprint";
import { useRouter } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useAppForm } from "@/hooks/use-app-form";
import { useAddBlueprint } from "../../api/use-add-blueprint";

// TODO: Cleanup this form

export const APIBlueprintForm: FC = () => {
  const [showPagination, setShowPagination] = useState(false);
  const router = useRouter();

  const addBlueprint = useAddBlueprint();
  const form = useAppForm({
    defaultValues: {
      type: BlueprintType.API,
      name: "",
      url: "",
      baseUrl: "",
      config: {
        apiBaseUrl: "",
        fields: [{ key: "", selector: "" }],
        headers: {},
        method: "GET",
        pagination: {},
        query: {},
      },
    } as EditableAPIBlueprint,
    validators: {
      onChange: apiEditableBlueprintSchema,
    },
    listeners: {
      onChange: ({ formApi, fieldApi }) => {
        if (!(fieldApi.getInfo().instance?.name === "config.pagination.type"))
          return null;

        const paginationType = formApi.getFieldValue("config.pagination.type");
        const fieldToCheck = formApi.getFieldValue(
          "config.pagination.fieldToCheck"
        );
        switch (paginationType) {
          case "cursor":
            formApi.setFieldValue("config.pagination", {
              fieldToCheck: fieldToCheck ?? "",
              type: "cursor",
              path: {
                queryKey: "",
                path: "",
              },
            });
            break;
          case "nextPage":
            formApi.setFieldValue("config.pagination", {
              fieldToCheck: fieldToCheck ?? "",
              type: "nextPage",
              path: "",
            });
            break;
          case "offsetLimit":
            formApi.setFieldValue("config.pagination", {
              fieldToCheck: fieldToCheck ?? "",
              type: "offsetLimit",
              offset: {
                queryKey: "",
                value: 0,
              },
              limit: {
                queryKey: "",
                value: 0,
              },
            });
            break;
          case "pageSize":
            formApi.setFieldValue("config.pagination", {
              fieldToCheck: fieldToCheck ?? "",
              type: "pageSize",
              page: {
                queryKey: "",
                value: 0,
              },
              size: {
                queryKey: "",
                value: 0,
              },
            });
            break;
        }
      },
    },
    onSubmit: ({ value }) => {
      addBlueprint.mutate(value);
      router.navigate({ to: "/blueprints" });
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
        fieldToCheck: "",
        type: "cursor",
        path: {
          queryKey: "",
          path: "",
        },
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
              name="baseUrl"
              children={(field) => <field.TextField label="Base URL" />}
            />
            <form.AppField
              name="config.apiBaseUrl"
              children={(field) => <field.TextField label="API Base URL" />}
            />
            <div className="flex flex-col gap-2">
              <Label>Elements</Label>
              <form.AppField
                mode="array"
                name="config.fields"
                children={(field) => (
                  <>
                    {field.state.value.map((_, index) => (
                      <>
                        <div className="grid grid-cols-6 gap-2">
                          <form.AppField
                            name={`config.fields[${index}].key`}
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
                            name={`config.fields[${index}].selector`}
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
                          <Button
                            variant={"destructive"}
                            className="col-span-1 h-full"
                            onClick={() => field.removeValue(index)}
                          >
                            <XIcon />
                          </Button>
                        </div>
                      </>
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
            {showPagination && (
              <>
                <div className="flex gap-2">
                  <form.AppField
                    name="config.pagination.type"
                    children={(field) => (
                      <field.SelectField
                        label="Pagination variant"
                        triggerLabel="Type"
                        options={[
                          { label: "Cursor", value: "cursor" },
                          { label: "Next page", value: "nextPage" },
                          { label: "Page size", value: "pageSize" },
                          { label: "Offset limit", value: "offsetLimit" },
                        ]}
                      />
                    )}
                  />
                  <form.AppField
                    name="config.pagination.fieldToCheck"
                    children={(field) => (
                      <field.TextField label="Field to check" />
                    )}
                  />
                </div>
                <form.Subscribe
                  selector={(state) => state.values.config.pagination?.type}
                  children={(paginationType) => (
                    <>
                      {paginationType === "cursor" && (
                        <div className="flex gap-2">
                          <form.AppField
                            name="config.pagination.path.queryKey"
                            children={(field) => (
                              <field.TextField label="Cursor query key" />
                            )}
                          />
                          <form.AppField
                            name="config.pagination.path.path"
                            children={(field) => (
                              <field.TextField label="Cursor path" />
                            )}
                          />
                        </div>
                      )}
                      {paginationType === "nextPage" && (
                        <form.AppField
                          name="config.pagination.path"
                          children={(field) => (
                            <field.TextField label="Page path" />
                          )}
                        />
                      )}
                      {paginationType === "pageSize" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2 w-full">
                            <form.AppField
                              name="config.pagination.page.queryKey"
                              children={(field) => (
                                <field.TextField label="Page query key" />
                              )}
                            />
                            <form.AppField
                              name="config.pagination.page.value"
                              children={(field) => (
                                <field.NumberField label="Page number" />
                              )}
                            />
                          </div>
                          <div className="flex gap-2 w-full">
                            <form.AppField
                              name="config.pagination.size.queryKey"
                              children={(field) => (
                                <field.TextField label="Size query key" />
                              )}
                            />
                            <form.AppField
                              name="config.pagination.size.value"
                              children={(field) => (
                                <field.NumberField label="Size number" />
                              )}
                            />
                          </div>
                        </div>
                      )}
                      {paginationType === "offsetLimit" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <form.AppField
                              name="config.pagination.offset.queryKey"
                              children={(field) => (
                                <field.TextField label="Offset query key" />
                              )}
                            />
                            <form.AppField
                              name="config.pagination.offset.value"
                              children={(field) => (
                                <field.NumberField label="Offset number" />
                              )}
                            />
                          </div>
                          <div className="flex gap-2">
                            <form.AppField
                              name="config.pagination.limit.queryKey"
                              children={(field) => (
                                <field.TextField label="Limit query key" />
                              )}
                            />
                            <form.AppField
                              name="config.pagination.limit.value"
                              children={(field) => (
                                <field.NumberField label="Limit number" />
                              )}
                            />
                          </div>
                        </div>
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
        {/* <form.AppForm>
          <form.SubmitButton btnText="Add blueprint" />
        </form.AppForm> */}
        <Button onClick={form.handleSubmit}>Add blueprint</Button>
      </div>
    </>
  );
};
