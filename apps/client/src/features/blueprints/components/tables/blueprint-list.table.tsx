import type { FC } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import type { BlueprintListResponse } from '../../api/blueprints.types'
import { columns } from './blueprint-list.columns'


type BlueprintListTableProps = {
  blueprints: BlueprintListResponse["data"]
}

export const BlueprintListTable: FC<BlueprintListTableProps> = ({ blueprints }) => {

  return <DataTable data={blueprints} columns={columns}  />
}
