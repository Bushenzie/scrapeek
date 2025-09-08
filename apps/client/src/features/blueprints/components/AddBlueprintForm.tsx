// import { useStore } from "@tanstack/react-form";
import { type FC } from "react";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useAppForm } from "@/hooks/use-app-form";

export const AddBlueprintForm: FC = () => {
  const defaultValues = {
    type: "api" as "api" | "static" | "dynamic",
    name: "Blueprint",
    url: "http://localhost:3001/api/offers",
    pagination: true,
    count: 1,
    test: "wtf" as "wtf" | "lol" | "omg",
    // baseUrl: "http://localhost:3001",
    // config: {},
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value));
    },
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
              children={(field) => <field.TextField label="Name" />}
            />
            <form.AppField
              name="url"
              children={(field) => <field.TextField label="URL" />}
            />
            <form.AppField
              name="type"
              children={(field) => (
                <field.RadioGroupField
                  label="Type"
                  options={[
                    {
                      label: "API",
                      value: "api",
                    },
                    {
                      label: "Static",
                      value: "static",
                    },
                    {
                      label: "Dynamic",
                      value: "dynamic",
                    },
                  ]}
                />
              )}
            />
            <form.AppField
              name={"pagination"}
              children={(field) => <field.CheckboxField label="Pagination" />}
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
