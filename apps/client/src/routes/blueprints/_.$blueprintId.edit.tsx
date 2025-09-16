import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Box } from "@/components/ui/box/box";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Separator } from "@/components/ui/separator/separator";
import { EditBlueprint } from "@/features/blueprints/components/edit-blueprint";

export const Route = createFileRoute("/blueprints/_/$blueprintId/edit")({
  component: ViewBlueprintPage,
});

function ViewBlueprintPage() {
  const { blueprintId } = Route.useParams();

  return (
    <div>
      <GoBackButton className="h-max" fallbackTo=".." />
      <Box className="w-full">
        <div className="flex justify-between p-6">
          <h1 className="text-2xl">Blueprint Edit</h1>
        </div>
        <Separator />
        <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
          <EditBlueprint blueprintId={blueprintId} />
        </Suspense>
      </Box>
    </div>
  );
}
