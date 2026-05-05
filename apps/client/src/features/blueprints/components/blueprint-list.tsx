import { useQuery } from "@tanstack/react-query"
import { blueprintListOptions } from "../api/blueprints.queries"
import { BlueprintListTable } from "./tables/blueprint-list.table"

export const BlueprintList = () => {
  const { data: blueprints } = useQuery(blueprintListOptions())

  return (
    <div className="flex flex-col">
      {blueprints?.data?.length === 0 && (
        <span className="text-blueprint-200 text-center my-4">No blueprints found</span>
      )}
      <BlueprintListTable blueprints={blueprints?.data ?? []} />
    </div>
  )
}
