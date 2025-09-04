import { createFileRoute } from "@tanstack/react-router";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";

export const Route = createFileRoute("/blueprints/$blueprintId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { blueprintId } = Route.useParams();

  return (
    <div>
      <GoBackButton />
      Blueprint {blueprintId}
    </div>
  );
}
