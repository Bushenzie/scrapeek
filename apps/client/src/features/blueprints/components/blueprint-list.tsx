import { Link } from "@tanstack/react-router";
import { useBlueprintsList } from "../api/queries/use-blueprints-list";

export const BlueprintList = () => {
  const { data: blueprints } = useBlueprintsList();

  return (
    <div className="flex flex-col">
      {blueprints.length > 0 &&
        blueprints.map((blueprint) => (
          <Link
            to="/blueprints/$blueprintId"
            params={{
              blueprintId: blueprint.id,
            }}
            className="flex justify-between p-2 border-b border-blueprint-400/50 last-of-type:border-none last-of-type:rounded-4xl hover:bg-blueprint-700"
            key={blueprint.id}
          >
            <div className="flex flex-col gap-1 py-2 px-4">
              <h1 className="text-md">{blueprint.name}</h1>
              <p className="text-sm text-blueprint-200">
                {blueprint.type.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};
