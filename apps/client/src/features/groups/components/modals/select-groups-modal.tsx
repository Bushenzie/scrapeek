import { groupInsertSchema, groupUpdateSchema } from "@scrapeek/db/validators";
import { useQuery } from "@tanstack/react-query";
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
import { groupsListOptions } from "../../api/groups.queries";

export const SelectGroupsModal = () => {
  const {data:groups} = useQuery(groupsListOptions())

  return (
    <Dialog>
      <DialogTrigger className="z-10">
        <Button variant={"link"}>Select group</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DialogTitle>Select group</DialogTitle>
          {groups?.map(test => (test.name))}
          {/*<form.AppField name="name" children={(field) => <field.TextField label="Name" />} />
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton btnText={groupId ? "Edit" : "Add"} />
            </form.AppForm>
          </DialogFooter>*/}
        </form>
      </DialogContent>
    </Dialog>
  );
};
