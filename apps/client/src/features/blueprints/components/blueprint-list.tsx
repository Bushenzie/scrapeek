import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { useBlueprintsList } from "../api/queries/use-blueprints-list";
import { RemoveBlueprintModal } from "./remove-blueprint-modal";

export const BlueprintList = () => {
  const { data } = useBlueprintsList();

  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        {data.length > 0 &&
          data.map((blueprint) => (
            <div
              className="flex justify-between p-2 hover:bg-blueprint-700"
              key={blueprint.id}
            >
              <div className="flex flex-col gap-1">
                <Link
                  to="/blueprints/$blueprintId"
                  params={{
                    blueprintId: blueprint.id,
                  }}
                  className="text-md"
                >
                  {blueprint.name}
                </Link>
                <p className="text-sm text-blueprint-200">
                  {blueprint.type.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 pr-4">
                <RemoveBlueprintModal blueprintId={blueprint.id} />
              </div>
            </div>
          ))}
      </Suspense>
    </div>
  );
};
