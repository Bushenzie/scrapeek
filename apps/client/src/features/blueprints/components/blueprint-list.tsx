import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { formatDistance } from "date-fns";
import { blueprintListOptions } from "../api/blueprints.queries";

export const BlueprintList = () => {
  const { data: blueprints } = useQuery(blueprintListOptions());

  return (
    <div className="flex flex-col">
      {blueprints?.length === 0 && (
        <span className="text-blueprint-200 text-center my-4">
          No blueprints found
        </span>
      )}
      {(blueprints ?? [])?.length > 0 &&
        blueprints?.map((blueprint) => (
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
              <p className="text-sm space-x-2 text-blueprint-200">
                <span>{blueprint.type.toUpperCase()}</span>
                <span>|</span>
                <span>
                  Last scrape:{" "}
                  {blueprint?.result?.updatedAt ? (
                    <>
                      {formatDistance(blueprint?.result?.updatedAt, new Date(), {
                        addSuffix: true,
                      })}
                    </>
                  ) : (
                    "never"
                  )}
                </span>
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};
