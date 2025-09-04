import { blueprintSchema } from "@scrapeek/shared/blueprint";
import { Link } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { zocker } from "zocker";

export const BlueprintList = async () => {
  const mockData = zocker(blueprintSchema).generateMany(10);

  return (
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
  );
};
