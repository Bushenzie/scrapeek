import { useRouter } from "@tanstack/react-router";
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
import { authClient } from "@/lib/clients/auth";

export const DeleteAccountModal = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    await authClient.deleteUser();
    router.navigate({ to: "/" });
  };

  return (
    <Dialog>
      <DialogTrigger className="z-10" asChild>
        <Button variant={"destructive"}>Remove account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Remove acount</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove your account
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
