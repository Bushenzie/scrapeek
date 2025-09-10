import {
  BlueprintType,
  type EditableAPIBlueprint,
} from "@scrapeek/shared/blueprint";
import type { FC } from "react";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useAppForm } from "@/hooks/use-app-form";

export const APIBlueprintForm: FC = () => {
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
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
            onClick={() => form.handleSubmit()}
            btnText="Add blueprint"
          />
        </form.AppForm>
      </div>
    </>
  );
};
