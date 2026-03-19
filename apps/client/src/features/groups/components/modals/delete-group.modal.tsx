import { type FC } from "react";
import { Modal } from "@/components/modal/modal";
import { useDeleteGroup } from "../../api/groups.mutations";

type DeleteGroupModalProps = {
  groupId: string;
  isDropdownMenuItem?: boolean
};

export const DeleteGroupModal: FC<DeleteGroupModalProps> = ({ groupId, isDropdownMenuItem = false }) => {
  const deleteGroup = useDeleteGroup();

  return (
    <Modal
      title={`Delete group`}
      description={"Are you sure you want to delete this group?"}
      submitBtn={{
        text: "Confirm",
        onSubmit: () => deleteGroup.mutate({param: {id: groupId}})
      }}
      trigger={{
        content: "Delete group",
      }}
      isDropdownMenuItem={isDropdownMenuItem}
      />

  );
};
