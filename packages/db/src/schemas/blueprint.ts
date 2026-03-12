import {
	boolean,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { BLUEPRINT_TYPES } from "../lib/constants";

export const configType = pgEnum("blueprint_type", BLUEPRINT_TYPES);

export const blueprint = pgTable("blueprint", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	type: configType("blueprint_type").notNull(),
	userId: text("user_id")
		.references(() => user.id)
		.notNull(),
	url: varchar("url", { length: 512 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }),
	respectRobotsTxt: boolean("respect_robots_txt").default(true).notNull(),
	config: jsonb("config").notNull(),
	public: boolean("public").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
