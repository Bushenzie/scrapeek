import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";

import { Separator } from "@/components/ui/separator/separator";
import { AddBlueprintDialog } from "@/features/blueprints/components/add-blueprint-modal";
import { BlueprintList } from "@/features/blueprints/components/blueprint-list";

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
      <BlueprintList />
    </Box>
  );
}
