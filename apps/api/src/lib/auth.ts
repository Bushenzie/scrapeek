import * as authSchema from "@scrapeek/db/auth-schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, openAPI } from "better-auth/plugins";
import { db } from "@/lib/db.ts";
import { env } from "./env.ts";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
	}),
	user: {
		deleteUser: {
			enabled: true,
		},
	},
	trustedOrigins: [env.CLIENT_URL],
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		gitlab: {
			clientId: env.GITLAB_CLIENT_ID,
			clientSecret: env.GITLAB_CLIENT_SECRET,
		},
	},

	plugins: [
		openAPI(),
		apiKey({
			defaultPrefix: "scrpk_",
			rateLimit: {
				// TODO: tweak this
				enabled: true,
				maxRequests: 100,
				timeWindow: 1000 * 60 * 60,
			},
		}),
	],
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
