import { type FC, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { useBlueprintDetail } from "../api/queries/use-blueprint-detail";
import { APIBlueprintForm } from "./forms/api-blueprint-form";
import { DynamicBlueprintForm } from "./forms/dynamic-blueprint-form";
import { StaticBlueprintForm } from "./forms/static-blueprint-form";

type ViewBlueprintProps = {
  blueprintId: string;
};

export const ViewBlueprint: FC<ViewBlueprintProps> = ({ blueprintId }) => {
  const { data: blueprint } = useBlueprintDetail({ blueprintId });

  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        {blueprint.type === "api" && <APIBlueprintForm blueprint={blueprint} />}
        {blueprint.type === "static" && (
          <StaticBlueprintForm blueprint={blueprint} />
        )}
        {blueprint.type === "dynamic" && (
          <DynamicBlueprintForm blueprint={blueprint} />
        )}
      </Suspense>
    </div>
  );
};
