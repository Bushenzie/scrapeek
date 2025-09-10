import { type Blueprint } from "@scrapeek/shared/blueprint";
import { type FC, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Textarea } from "@/components/ui/textarea/textarea";

type ViewBlueprintProps = {
  blueprint: Blueprint;
};

export const ViewBlueprint: FC<ViewBlueprintProps> = ({ blueprint }) => {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        <Textarea value={JSON.stringify(blueprint, null, 4)} readOnly />
      </Suspense>
    </div>
  );
};
