import { Trash } from "lucide-react";
import { type FC } from "react";
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
    <Dialog>
      <DialogTrigger className="z-10" asChild>
        <Button variant={"destructive"}>
          <Trash className="w-5 h-5 p-0 m-0" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete blueprint</DialogTitle>
        <DialogDescription>Are you sure you want to delete this blueprint?</DialogDescription>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={handleSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
