import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { blueprint } from "./blueprint";

export const upvote = pgTable("upvote", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	userId: text("user_id")
		.references(() => user.id)
		.notNull(),
	blueprintId: uuid("blueprint_id")
		.references(() => blueprint.id)
		.notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
