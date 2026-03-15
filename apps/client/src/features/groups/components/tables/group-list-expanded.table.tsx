
import type { FC } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import type { GroupListResponse } from '../../api/groups.types'
import { columns } from './group-list-expanded.columns'

type GroupListExpandedTableProps = {
  blueprints: GroupListResponse["data"][number]["blueprints"]
}

export const GroupListExpandedTable: FC<GroupListExpandedTableProps> = ({blueprints}) => {
  return <DataTable columns={columns} data={blueprints} showHeaders={false} />
}
