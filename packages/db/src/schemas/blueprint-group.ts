import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { group } from "./group";
import { blueprint } from "./blueprint";

export const blueprintGroup = pgTable(
	"blueprint_group",
	{
		groupId: uuid("group_id")
			.references(() => group.id)
			.notNull(),
		blueprintId: uuid("blueprint_id")
			.references(() => blueprint.id)
			.notNull(),
	},
	(table) => [primaryKey({ columns: [table.groupId, table.blueprintId] })],
);
