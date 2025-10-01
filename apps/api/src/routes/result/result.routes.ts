import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db";
import { resultTable } from "@/db/schemas/result";
import { apiKeyMiddleware } from "@/middlewares/api-key-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { resultParamSchema } from "./result.schemas";

const app = new Hono()
  .use(apiKeyMiddleware)
  .get("/:id", zodValidator("param", resultParamSchema), async (c) => {
    const { id } = c.req.valid("param");

    const result = await db.query.resultTable
      .findFirst({
        where: eq(resultTable.id, id),
      })
      .catch(() => {
        throw new Error("No result found");
      });

    return c.json({ data: result });
  });

export default app;
