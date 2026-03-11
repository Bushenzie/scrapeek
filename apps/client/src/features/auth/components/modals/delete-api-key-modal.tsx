import { Trash } from "lucide-react";
import type { FC } from "react";
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
    <Dialog>
      <DialogTrigger className="z-10" asChild>
        <Button variant={"link"} size="icon">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete "{name}"</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete "{name}" API Key?
        </DialogDescription>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={handleDeleteClick}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
