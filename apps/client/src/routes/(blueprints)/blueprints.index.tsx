import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blueprints)/blueprints/")({
  component: RouteComponent,
});
async function RouteComponent() {
  return <div className="w-screen h-screen"></div>;
}
