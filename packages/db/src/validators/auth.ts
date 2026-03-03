import { createSelectSchema } from "drizzle-orm/zod";
import { user } from "../schemas";

export const userSelectSchema = createSelectSchema(user);
