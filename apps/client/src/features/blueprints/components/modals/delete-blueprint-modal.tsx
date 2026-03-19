import { Trash } from "lucide-react";
import { type FC } from "react";
import { Modal } from "@/components/modal/modal";
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
import { useDeleteBlueprint } from "../../api/blueprints.mutations";

type DeleteBlueprintModalProps = {
  blueprintId: string;
};

export const DeleteBlueprintModal: FC<DeleteBlueprintModalProps> = ({ blueprintId }) => {
  const deleteBlueprint = useDeleteBlueprint();

  const handleSubmit = async () => {
    await deleteBlueprint.mutateAsync({ param: {id: blueprintId}});
  };

  return (
    <Modal
      title={`Delete blueprint`}
      description={"Are you sure you want to delete this blueprint?"}
      trigger={{
          content: (<Trash className="w-5 h-5 p-0 m-0" />),
          props: {
            variant: "destructive"
          }
        }}
      submitBtn={{
        text: "Delete",
        onSubmit: handleSubmit
      }}
    />


  );
};
