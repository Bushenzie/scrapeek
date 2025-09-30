import * as apiKeysSchema from "./api-keys.ts";
import * as authSchema from "./auth.ts";
import * as blueprintSchema from "./blueprint.ts";
import * as resultSchema from "./result.ts";

export const schema = {
  ...authSchema,
  ...resultSchema,
  ...blueprintSchema,
  ...apiKeysSchema,
};
