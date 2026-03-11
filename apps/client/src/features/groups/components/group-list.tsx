import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { groupsListOptions } from "../api/groups.queries";
import { columns as blueprintListColumns } from "./blueprint-list-table.columns";
import { columns as groupListColumns } from "./group-list.columns";

type GroupListProps = {};

export const GroupList: FC<GroupListProps> = ({}) => {
  const { data: groups } = useQuery(groupsListOptions());

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        data={groups}
        columns={groupListColumns}
        // @ts-expect-error this should work
        renderExpandedRow={(row) => <DataTable data={row.original?.blueprints ?? []} columns={blueprintListColumns} />}
      />
    </div>
  );
};
