import { createFileRoute } from "@tanstack/react-router";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";

export const Route = createFileRoute("/blueprints/$blueprintId")({
  component: ViewBlueprintPage,
});

function ViewBlueprintPage() {
  const { blueprintId } = Route.useParams();

  return (
    <div>
      <GoBackButton />
      Viewing {blueprintId}
    </div>
  );
}
