import { createFileRoute } from "@tanstack/react-router";
import { PenBoxIcon } from "lucide-react";
import { Suspense } from "react";
import { Box } from "@/components/ui/box/box";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";
// import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";
import { LinkButton } from "@/components/ui/link-button/link-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Separator } from "@/components/ui/separator/separator";
import { BlueprintDetail } from "@/features/blueprints/components/blueprint-detail";
import { RemoveBlueprintModal } from "@/features/blueprints/components/modals/remove-blueprint-modal";

export const Route = createFileRoute("/blueprints/$blueprintId")({
  component: ViewBlueprintPage,
});

function ViewBlueprintPage() {
  const { blueprintId } = Route.useParams();

  return (
    <div>
      <GoBackButton />
      <Box className="w-full">
        <div className="flex justify-between p-6">
          <h1 className="text-2xl">Blueprint</h1>
          <div className="flex gap-2 items-center">
            <LinkButton
              params={{ blueprintId }}
              to="/blueprints/$blueprintId/edit"
            >
              <PenBoxIcon className="w-6 h-6 text-blueprint-100" />
            </LinkButton>
            <RemoveBlueprintModal blueprintId={blueprintId} />
          </div>
          {/* <GoBackButton /> */}
        </div>
        <Separator />
        <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
          <BlueprintDetail blueprintId={blueprintId} />
        </Suspense>
      </Box>
    </div>
  );
}
