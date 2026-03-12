import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { blueprintDetailOptions } from "../api/blueprints.queries";
import { APIBlueprintForm } from "./forms/api-blueprint-form";
import { DynamicBlueprintForm } from "./forms/dynamic-blueprint-form";
import { StaticBlueprintForm } from "./forms/static-blueprint-form";

type EditBlueprintProps = {
  blueprintId: string;
};

export const EditBlueprint: FC<EditBlueprintProps> = ({ blueprintId }) => {
  const { data: blueprint } = useQuery(blueprintDetailOptions(blueprintId));

  return (
    <div className="flex flex-col p-6">
      {blueprint?.type === "api" && <APIBlueprintForm blueprint={blueprint} />}
      {blueprint?.type === "static" && (
        <StaticBlueprintForm blueprint={blueprint} />
      )}
      {blueprint?.type === "dynamic" && (
        <DynamicBlueprintForm blueprint={blueprint} />
      )}
    </div>
  );
};
