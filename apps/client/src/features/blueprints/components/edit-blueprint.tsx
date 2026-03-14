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
  const { data: blueprint } = useQuery(blueprintDetailOptions({
    param: {
      id: blueprintId
    }
  }));

  return (
    <div className="flex flex-col p-6">
        {/* @ts-expect-error TODO */}
      {blueprint?.type === "api" && <APIBlueprintForm blueprint={blueprint} />}
      {blueprint?.type === "static" && (
        // @ts-expect-error TODO
        <StaticBlueprintForm blueprint={blueprint} />
      )}
      {blueprint?.type === "dynamic" && (
        // @ts-expect-error TODO
        <DynamicBlueprintForm blueprint={blueprint} />
      )}
    </div>
  );
};
