
import type { FC } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import type { GroupListResponse } from '../../api/groups.types'
import { columns } from './group-list.columns'

type GroupListTableProps = {
  groups: GroupListResponse["data"]
}

export const GroupListTable: FC<GroupListTableProps> = ({groups}) => {
  return <DataTable data={groups} columns={columns} renderExpandedRow={(row) => (
    <> { row.original.blueprints[0] }</>
  )} />
}
