import { groupInsertSchema } from "@scrapeek/db/validators";
import { FolderPen, FolderPlus } from "lucide-react";
import { type FC } from "react";
import { Modal } from "@/components/modal/modal";
import { useAppForm } from "@/hooks/use-app-form";
import { useCreateGroup } from "../../api/groups.mutations";

type EditCreateGroupModalProps = {
  groupId?: string;
};

export const EditCreateGroupModal: FC<EditCreateGroupModalProps> = ({ groupId }) => {
  const createGroup = useCreateGroup();

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: groupInsertSchema,
    },
    onSubmit: ({ value }) => {
      createGroup.mutate({
        json: {
          name: value.name,
        }
      })
    },
  });

  return (
    <Modal
      title={`${groupId ? "Edit" : "Add"} group`}
      trigger={{
          text: groupId ? <FolderPen /> : <FolderPlus />,
          props: {
            size: "icon",
            variant: "link"
          }
        }}
      submitBtn={{
        text: groupId ? "Edit" : "Add",
        onSubmit: form.handleSubmit
      }}
    >
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
      >
        <form.AppField name="name" children={(field) => <field.TextField label="Name" />} />

        </form>
    </Modal>

  );
};
