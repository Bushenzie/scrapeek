import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import { blueprintListPublicOptions } from "../api/blueprints.queries";
import { PublicBlueprintListItem } from "./public-blueprint-list-item";

export const PublicBlueprintsList = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery(blueprintListPublicOptions());

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cold-2 lg:grid-cols-3 p-2 gap-2 w-full">
        {data?.blueprints?.length === 0 && (
          <span className="text-blueprint-200 text-center col-span-full my-4">
            No public blueprints found
          </span>
        )}
        {(data?.blueprints ?? []).length > 0 &&
          data?.blueprints?.map((blueprint) => (
            <PublicBlueprintListItem key={blueprint.id} blueprint={blueprint} />
          ))}
      </div>
      <div className="flex items-center justify-center my-4">
        <Pagination
          currentPage={page}
          itemsPerPage={12}
          itemsTotal={data?.totalCount ?? 0}
          setCurrentPage={setPage}
        />
      </div>
    </>
  );
};
