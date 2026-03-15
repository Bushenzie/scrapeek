import { Trash } from "lucide-react";
import type { FC } from "react";
import { Modal } from "@/components/modal/modal";
import { useDeleteApiKey } from "../../api/auth.mutations";

type DeleteApiKeyModalProps = {
  id: string;
  name: string;
};

export const DeleteApiKeyModal: FC<DeleteApiKeyModalProps> = ({ id, name }) => {
  const deleteApiKeyMutation = useDeleteApiKey();

  const handleDeleteClick = () => {
    deleteApiKeyMutation.mutate(id);
  };

  return (
    <Modal
      title={`Delete "${name}`}
      description={`Are you sure you want to delete "${name}" API Key?`}
      trigger={{
          text: (<Trash />),
          props: {
            size: "icon",
            variant: "link"
          }
        }}
      submitBtn={{
        text: "Delete",
        onSubmit: handleDeleteClick
      }}
    />
  );
};
