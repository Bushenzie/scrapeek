import * as authSchema from "./auth.ts";
import * as blueprintSchema from "./blueprint.ts";
import * as resultSchema from "./result.ts";
import * as upvoteSchema from "./upvote.ts";

export const schema = {
  ...authSchema,
  ...resultSchema,
  ...blueprintSchema,
  ...upvoteSchema,
};
