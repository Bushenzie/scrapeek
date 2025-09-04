import { createFileRoute } from "@tanstack/react-router";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";

export const Route = createFileRoute("/blueprints/_/$blueprintId/edit")({
  component: EditBlueprintPage,
});

function EditBlueprintPage() {
  const { blueprintId } = Route.useParams();

  return (
    <div>
      <GoBackButton />
      Editing {blueprintId}
    </div>
  );
}
