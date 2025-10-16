import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth.ts";
import { resultTable } from "./result.ts";
import { upvoteTable } from "./upvote.ts";

export const configTypeEnum = pgEnum("type", ["api", "static", "dynamic"]);

export const blueprintTable = pgTable("blueprint", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  type: configTypeEnum("type").notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  respectRobotsTxt: boolean("respect_robots_txt").default(true).notNull(),
  config: jsonb("config").notNull(),
  public: boolean("public").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blueprintRelations = relations(
  blueprintTable,
  ({ one, many }) => ({
    result: one(resultTable, {
      fields: [blueprintTable.id],
      references: [resultTable.blueprintId],
    }),
    user: one(user, {
      fields: [blueprintTable.userId],
      references: [user.id],
    }),
    upvotes: many(upvoteTable),
  })
);
