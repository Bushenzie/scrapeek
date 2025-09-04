import {
  type EditableBlueprint,
  editableBlueprintSchema,
} from "@scrapeek/shared/blueprint";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";
import { Button } from "@/components/ui/button/button";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";
import { Input } from "@/components/ui/input/input";
import { Separator } from "@/components/ui/separator/separator";

export const Route = createFileRoute("/blueprints/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
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
    <div>
      <GoBackButton />
      <Box>
        <div className="flex items-start flex-col gap-2">
          <h1 className="text-2xl">Add blueprint</h1>
        </div>
        <Separator className="my-4" />
        <form onSubmit={handleSubmit}>
          <form.Field
            name="name"
            validators={{
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <Input
                value={field.state.value}
                name={field.name}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
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
      </Box>
    </div>
  );
}
