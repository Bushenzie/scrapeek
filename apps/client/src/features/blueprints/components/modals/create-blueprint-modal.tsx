import { BlueprintType } from "@scrapeek/db/constants";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import { blueprintTypeSelectSchema } from "../../schemas/blueprint-type";

export const CreateBlueprintDialog = () => {
  const router = useRouter();

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
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Select type</DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <form.AppField
            name="type"
            children={(field) => (
              <field.RadioGroupField
                label=""
                options={[
                  { label: "API", value: BlueprintType.API },
                  { label: "Static", value: BlueprintType.Static },
                  { label: "Dynamic", value: BlueprintType.Dynamic },
                ]}
              />
            )}
          />
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>Close</Button>
            </DialogClose>

            <Button type="submit" onClick={form.handleSubmit}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
