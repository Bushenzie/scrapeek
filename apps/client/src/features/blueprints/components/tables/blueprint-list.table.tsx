
import type { BlueprintWithRelations } from '@scrapeek/db/validators'
import type { FC } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { columns } from './blueprint-list.columns'
import type { BlueprintListResponse } from '../../api/blueprints.types'


type BlueprintListTableProps = {
  blueprints: BlueprintListResponse["data"]
}

export const BlueprintListTable: FC<BlueprintListTableProps> = ({ blueprints }) => {

  return <DataTable data={blueprints} columns={columns}  />
}
