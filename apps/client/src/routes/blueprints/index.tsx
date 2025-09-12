import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Box } from "@/components/ui/box/box";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Separator } from "@/components/ui/separator/separator";
import { BlueprintList } from "@/features/blueprints/components/blueprint-list";
import { AddBlueprintDialog } from "@/features/blueprints/components/modals/add-blueprint-modal";

export const Route = createFileRoute("/blueprints/")({
  component: BlueprintsPage,
});

function BlueprintsPage() {
  return (
    <Box className="w-full">
      <div className="flex justify-between">
        <h1 className="text-2xl">Blueprints</h1>
        <AddBlueprintDialog />
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        <BlueprintList />
      </Suspense>
    </Box>
  );
}
