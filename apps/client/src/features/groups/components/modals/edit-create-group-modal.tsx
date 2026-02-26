import { FolderPen, FolderPlus } from "lucide-react";
import { type FC } from "react";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import { editableGroupSchema } from "@scrapeek/shared/group";
import { useAddGroup } from "../../api/mutations/use-add-group";
import { useGetGroups } from "../../api/queries/use-get-groups";

type EditCreateGroupModalProps = {
  groupId?: string;
};

export const EditCreateGroupModal: FC<EditCreateGroupModalProps> = ({ groupId }) => {
  const { data: groups } = useGetGroups();
  const { mutateAsync: createGroup } = useAddGroup({
    
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: editableGroupSchema,
      onSubmit: ({ value }) => {
        const alreadyExists = groups.find((group) => group.name === value.name);
        if (alreadyExists) return "Name already exists";
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      if (!groupId) await createGroup(value.name);
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="z-10" asChild>
        <Button>{groupId ? <FolderPen /> : <FolderPlus />} Group</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogTitle>{groupId ? "Edit" : "Add"} group</DialogTitle>
          <form.AppField name="name" children={(field) => <field.TextField label="Name" />} />
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton btnText={groupId ? "Edit" : "Add"} />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
