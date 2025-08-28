import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blueprints)/blueprints/$blueprintId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { blueprintId } = Route.useParams();

  return <div>Blueprint {blueprintId}</div>;
}
