import { parseEnv } from "@scrapeek/shared/utils";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
});

export const env = parseEnv(envSchema, process.env);
