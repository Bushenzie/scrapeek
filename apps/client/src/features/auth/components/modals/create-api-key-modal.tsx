import { z } from "zod";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import { authClient } from "@/lib/clients/auth";
import { useCreateAPIKey } from "../../api/mutations/use-create-api-key";

export const CreateApiKeyModal = () => {
  const createApiKeyMutation = useCreateAPIKey();

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(3),
      }),
    },
    onSubmit: async ({ value }) => {
      await createApiKeyMutation.mutate(value.name);
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="z-10" asChild>
        <Button variant={"destructive"}>Add API Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add API Key</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <form.AppForm>
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="API Key name" />}
            />
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <form.SubmitButton btnText="Add" />
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};
