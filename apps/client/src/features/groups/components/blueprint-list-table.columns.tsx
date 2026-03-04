import type { Blueprint } from "@scrapeek/db/validators";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnsHelper = createColumnHelper<Blueprint>();

export const columns = [
  columnsHelper.accessor("name", {
    header: "Name",
    cell: (row) => row.getValue(),
  }),
  columnsHelper.accessor("createdAt", {
    header: "Created At",
    cell: (row) => <>{format(row.getValue(), "dd.MM.yyyy / HH:mm")}</>,
  }),
];
