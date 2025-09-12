import { type FC } from "react";
import { useBlueprintDetail } from "../api/queries/use-blueprint-detail";

type BlueprintDetailProps = {
  blueprintId: string;
};

export const BlueprintDetail: FC<BlueprintDetailProps> = ({ blueprintId }) => {
  const { data: blueprint } = useBlueprintDetail({ blueprintId });

  return <div>Detail of {blueprint.name} blueprint</div>;
};
