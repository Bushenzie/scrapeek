import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().int().positive(),
	DATABASE_URL: z.url(),
	CLIENT_URL: z.url(),
	ENCRYPT_KEY: z.string(),
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string(),
	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GITLAB_CLIENT_ID: z.string(),
	GITLAB_CLIENT_SECRET: z.string(),
	GITLAB_ISSUER: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	throw new Error(parsedEnv.error.message);
}

export const env = parsedEnv.data;
