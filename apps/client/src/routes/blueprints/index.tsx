import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";
import { LinkButton } from "@/components/ui/link-button/link-button";
import { Separator } from "@/components/ui/separator/separator";
import { BlueprintList } from "@/features/blueprints/components/BlueprintList";

export const Route = createFileRoute("/blueprints/")({
  component: BlueprintsPage,
});

function BlueprintsPage() {
  return (
    <Box className="w-full">
      <div className="flex justify-between">
        <h1 className="text-2xl">Blueprints</h1>
        <LinkButton to="/blueprints/add">Add</LinkButton>
      </div>
      <Separator className="my-4" />
      <BlueprintList />
    </Box>
  );
}
