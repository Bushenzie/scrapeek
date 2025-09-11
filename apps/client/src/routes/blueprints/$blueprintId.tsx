import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Box } from "@/components/ui/box/box";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Separator } from "@/components/ui/separator/separator";
import { ViewBlueprint } from "@/features/blueprints/components/view-blueprint";

export const Route = createFileRoute("/blueprints/$blueprintId")({
  component: ViewBlueprintPage,
});

function ViewBlueprintPage() {
  const { blueprintId } = Route.useParams();

  return (
    <Box className="w-full">
      <div className="flex justify-between">
        <h1 className="text-2xl">Blueprint</h1>
        <GoBackButton />
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        <ViewBlueprint blueprintId={blueprintId} />
      </Suspense>
    </Box>
  );
}
