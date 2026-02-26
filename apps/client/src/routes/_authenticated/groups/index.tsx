import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Box } from "@/components/ui/box/box";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Separator } from "@/components/ui/separator/separator";
import { EditCreateGroupModal } from "@/features/groups/components/modals/edit-create-group-modal";
import { GroupList } from "@/features/groups/components/group-list";

export const Route = createFileRoute("/_authenticated/groups/")({
  component: GroupListPage,
});

function GroupListPage() {
  return (
    <Box className="w-full">
      <div className="flex justify-between p-6">
        <h1 className="text-2xl">Groups</h1>
        <div className="flex gap-2 items-center">
          <EditCreateGroupModal />
        </div>
      </div>
      <Separator />
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        <GroupList />
      </Suspense>
    </Box>
  );
}
