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
import { useRemoveBlueprint } from "../api/mutations/use-remove-blueprint";

type RemoveBlueprintModalProps = {
  blueprintId: string;
};

export const RemoveBlueprintModal: FC<RemoveBlueprintModalProps> = ({
  blueprintId,
}) => {
  const removeBlueprint = useRemoveBlueprint();

  const handleSubmit = () => {
    removeBlueprint.mutate(blueprintId);
  };

  return (
    <Dialog>
      <DialogTrigger className="z-10">
        <Button variant={"destructive"}>
          <Trash className="w-5 h-5 p-0 m-0" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Remove blueprint</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove this blueprint?
        </DialogDescription>
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
