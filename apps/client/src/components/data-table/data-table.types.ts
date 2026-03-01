import type { ColumnDef, Row } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type DataProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  paginationEnabled?: boolean;
};
