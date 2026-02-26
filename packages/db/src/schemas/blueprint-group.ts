import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { groupTable } from "./group";
import { blueprintTable } from "./blueprint";
import { relations } from "drizzle-orm";

export const blueprintGroupTable = pgTable(
  "blueprint_group",
  {
    groupId: uuid("group_id")
      .references(() => groupTable.id)
      .notNull(),
    blueprintId: uuid("blueprint_id")
      .references(() => blueprintTable.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.blueprintId] }),
  }),
);

export const blueprintGroupRelations = relations(blueprintGroupTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [blueprintGroupTable.groupId],
    references: [groupTable.id],
  }),
  blueprint: one(blueprintTable, {
    fields: [blueprintGroupTable.blueprintId],
    references: [blueprintTable.id],
  }),
}));
