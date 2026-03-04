import { defineRelations } from "drizzle-orm";
import { schema } from "../schemas";

export const relations = defineRelations(schema, (r) => ({
	user: {
		blueprints: r.many.blueprint(),
		groups: r.many.group(),
		upvotes: r.many.upvote(),
	},
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
		}),
	},
	apiKey: {
		user: r.one.user({
			from: r.apikey.userId,
			to: r.user.id,
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
	},
	blueprint: {
		user: r.one.user({
			from: r.blueprint.userId,
			to: r.user.id,
		}),
		groups: r.many.group({
			from: r.blueprint.id.through(r.blueprintGroup.blueprintId),
			to: r.group.id.through(r.blueprintGroup.groupId),
		}),
		result: r.one.result({
			from: r.blueprint.id,
			to: r.result.blueprintId,
		}),
		upvotes: r.many.upvote(),
	},
	result: {
		blueprint: r.one.blueprint({
			from: r.result.blueprintId,
			to: r.blueprint.id,
		}),
	},
	upvote: {
		user: r.one.user({
			from: r.upvote.userId,
			to: r.user.id,
		}),
		blueprint: r.one.blueprint({
			from: r.upvote.blueprintId,
			to: r.blueprint.id,
		}),
	},
	group: {
		user: r.one.user({
			from: r.group.userId,
			to: r.user.id,
		}),
		blueprints: r.many.blueprint({
			from: r.group.id.through(r.blueprintGroup.groupId),
			to: r.blueprint.id.through(r.blueprintGroup.blueprintId),
		}),
	},
}));
