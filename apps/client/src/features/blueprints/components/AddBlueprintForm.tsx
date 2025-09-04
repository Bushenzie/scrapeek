import { type FC } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { useAppForm } from "@/hooks/use-app-form";

const nameTestSchema = z.string().min(4, "Name must be atleast 4 characters");

export const AddBlueprintForm: FC = () => {
  const form = useAppForm({
    defaultValues: {
      type: "static",
      name: "Blueprint",
      baseUrl: "http://localhost:3001",
      config: {
        elements: {},
      },
    },
    listeners: {},
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <form.AppField
          name="name"
          validators={{ onChange: nameTestSchema }}
          children={(field) => <field.InputField label="name" />}
        />
        <form.Field
          name="type"
          children={(field) => (
            <Input
              value={field.state.value}
              name={field.name}
              onChange={(e) => field.handleChange(e.target.value as "api")}
            />
          )}
        />
      </form>
      <form.Subscribe
        selector={(state) => state.values}
        children={(state) => <h1>{state.name}</h1>}
      />
      <Button onClick={form.handleSubmit}>Add</Button>
    </>
  );
};
