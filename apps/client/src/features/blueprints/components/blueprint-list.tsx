import { type Blueprint } from "@scrapeek/shared/blueprint";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { axiosClient } from "@/lib/api/axios";

export const BlueprintList = () => {
  const { data } = useSuspenseQuery<Blueprint[]>({
    queryKey: ["blueprint"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<{ data: Blueprint[] }>(
          "/blueprints"
        );
        const blueprints = await response.data.data;
        return blueprints;
      } catch {
        throw new Error("Failed to fetch blueprints");
      }
    },
  });

  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        {data.length > 0 &&
          data.map((blueprint) => (
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
      </Suspense>
    </div>
  );
};
