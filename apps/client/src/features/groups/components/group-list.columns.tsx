import type { Group } from "@scrapeek/shared/group";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnsHelper = createColumnHelper<Group>();

export const columns = [
  columnsHelper.accessor("name", {
    header: "Name",
    cell: (row) => row.getValue(),
  }),
  columnsHelper.accessor("blueprints", {
    header: "Blueprint count",
    cell: (row) => row.getValue()?.length,
  }),
  columnsHelper.accessor("createdAt", {
    header: "Created At",
    cell: (row) => <>{format(row.getValue(), "dd.MM.yyyy / HH:mm")}</>,
  }),
];
