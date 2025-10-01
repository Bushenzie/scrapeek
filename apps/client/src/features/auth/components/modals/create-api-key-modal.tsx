import { type Dispatch, type FC, type SetStateAction } from "react";
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
import { Input } from "@/components/ui/input/input";
import { useAppForm } from "@/hooks/use-app-form";
import { useCreateAPIKey } from "../../api/mutations/use-create-api-key";

type CreateApiKeyModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const CreateApiKeyModal: FC<CreateApiKeyModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { data, mutate: createApiKey, reset } = useCreateAPIKey();

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(3),
      }),
    },
    onSubmit: async ({ formApi, value }) => {
      await createApiKey(value.name);
      formApi.reset();
    },
  });

  const handleClose = async () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
    >
      <DialogTrigger className="z-10" asChild>
        <Button>Add API Key</Button>
      </DialogTrigger>
      {!data ? (
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
              <DialogFooter className="mt-4">
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <form.SubmitButton btnText="Add" />
              </DialogFooter>
            </form.AppForm>
          </form>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogTitle>Copy API Key</DialogTitle>
          <DialogDescription>
            Copy your API Key as you will not be able to reveal it again upon
            losing it.
          </DialogDescription>
          <Input value={data} readOnly />
          <DialogFooter className="mt-2">
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
