import { useQuery } from "@tanstack/react-query"
import { groupsListOptions } from "../api/groups.queries"
import { GroupListTable } from "./tables/group-list.table"

export const GroupList = () => {
  const { data: groups } = useQuery(groupsListOptions())

  return (
    <div className="flex flex-col gap-2">
      <GroupListTable groups={groups?.data ?? []} />
    </div>
  )
}
