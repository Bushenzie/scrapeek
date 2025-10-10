import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";

export const Route = createFileRoute("/_authenticated/blueprints/browse")({
  component: BlueprintBrowsePage,
});

function BlueprintBrowsePage() {
  return (
    <Box className="p-4">
      <h1>Browse already created blueprints</h1>
    </Box>
  );
}
