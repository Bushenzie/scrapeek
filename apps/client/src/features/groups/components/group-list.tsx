import type { FC } from "react";
import { useGetGroups } from "../api/queries/use-get-groups";
import { DataTable } from "@/components/data-table/data-table";
import { columns as groupListColumns } from "./group-list.columns";
import { columns as blueprintListColumns } from "./blueprint-list-table.columns";

type GroupListProps = {};

export const GroupList: FC<GroupListProps> = ({}) => {
  const { data: groups } = useGetGroups();

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        data={groups}
        // @ts-expect-error this should work
        columns={groupListColumns}
        // @ts-expect-error this should work
        renderExpandedRow={(row) => <DataTable data={row.original?.blueprints ?? []} columns={blueprintListColumns} />}
      />
    </div>
  );
};
