import type { ColumnDef, Row } from "@tanstack/react-table"
import type { ReactNode } from "react"

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  showHeaders?: boolean
  pageSize?: number
  renderExpandedRow?: (row: Row<TData>) => ReactNode
  paginationEnabled?: boolean
}
