import { account, apikey, session, user, verification } from "./auth.ts";
import { blueprintGroup } from "./blueprint-group.ts";
import { blueprint } from "./blueprint.ts";
import { group } from "./group.ts";
import { result } from "./result.ts";
import { upvote } from "./upvote.ts";

export const schema = {
  user,
  account,
  verification,
  apikey,
  session,
  blueprint,
  blueprintGroup,
  group,
  result,
  upvote,
};

export * from "./auth.ts";
export * from "./blueprint-group.ts";
export * from "./blueprint.ts";
export * from "./group.ts";
export * from "./result.ts";
export * from "./upvote.ts";
