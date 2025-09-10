import { BlueprintType } from "@scrapeek/shared/blueprint";
import { z } from "zod";

export const blueprintTypeSelectSchema = z.object({
  type: z.enum([
    BlueprintType.API,
    BlueprintType.STATIC,
    BlueprintType.DYNAMIC,
  ]),
});
