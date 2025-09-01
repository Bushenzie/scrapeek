import { Box } from "@/components/ui/box/box";
import { Button } from "@/components/ui/button/button";
import { blueprintSchema } from "@scrapeek/shared/blueprint";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PenLine, Trash } from "lucide-react";
import { zocker } from "zocker";

export const Route = createFileRoute("/(blueprints)/blueprints/")({
  component: BlueprintList,
});

async function BlueprintList() {
  const mockData = zocker(blueprintSchema).generateMany(10);

  return (
    <div>
      <Box className="w-full">
        <div className="flex justify-between">
          <h1 className="text-2xl">Blueprints</h1>
          <Button>
            <Link to="/blueprints/add">Add</Link>
          </Button>
        </div>
        <div className="w-full h-[1px] bg-blueprint-200 my-4"></div>
        <div className="flex flex-col">
          {mockData.map((blueprint) => (
            <Link
              to="/blueprints/$blueprintId"
              params={{
                blueprintId: blueprint.id,
              }}
              className="flex justify-between cursor-pointer p-2 hover:bg-blueprint-700"
              key={blueprint.id}
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-md">{blueprint.name}</h2>
                <p className="text-sm text-blueprint-200">
                  {blueprint.type.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 pr-4">
                <Link
                  to="/blueprints/$blueprintId/edit"
                  params={{
                    blueprintId: blueprint.id,
                  }}
                  className="text-blueprint-200 p-0 m-0"
                >
                  <PenLine className="w-5 h-5" />
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </Box>
    </div>
  );
}
