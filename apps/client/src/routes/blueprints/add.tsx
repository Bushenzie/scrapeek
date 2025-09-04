import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";
import { Separator } from "@/components/ui/separator/separator";
import { AddBlueprintForm } from "@/features/blueprints/components/AddBlueprintForm";

export const Route = createFileRoute("/blueprints/add")({
  component: AddBlueprintPage,
});

function AddBlueprintPage() {
  return (
    <div>
      <GoBackButton />
      <Box>
        <div className="flex items-start flex-col gap-2">
          <h1 className="text-2xl">Add blueprint</h1>
        </div>
        <Separator className="my-4" />
        <AddBlueprintForm />
      </Box>
    </div>
  );
}
