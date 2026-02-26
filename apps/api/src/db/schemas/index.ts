import * as authSchema from "./auth.ts";
import * as blueprintGroupSchema from "./blueprint-group.ts";
import * as blueprintSchema from "./blueprint.ts";
import * as groupSchema from "./group.ts";
import * as resultSchema from "./result.ts";
import * as upvoteSchema from "./upvote.ts";

export const schema = {
  ...authSchema,
  ...resultSchema,
  ...blueprintSchema,
  ...upvoteSchema,
  ...groupSchema,
  ...blueprintGroupSchema,
};
