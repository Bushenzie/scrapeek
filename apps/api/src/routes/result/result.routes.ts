import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db";
import { resultTable } from "@/db/schemas/result";
import { StatusError } from "@/lib/error";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { resultHeaderSchema, resultParamSchema } from "./result.schemas";

const app = new Hono().get(
  "/:id",
  zodValidator("header", resultHeaderSchema),
  zodValidator("param", resultParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { Authorization } = c.req.valid("header");

    const result = await db.query.resultTable
      .findFirst({
        where: eq(resultTable.id, id),
      })
      .catch(() => {
        throw new Error("No result found");
      });

    const apiKey = Authorization.split(" ")[1];

    //TODO Only for testing before API key management
    if (apiKey !== "scrapeek_test") {
      throw new StatusError("Invalid API Key", 401);
    }

    return c.json({ data: result });
  }
);

export default app;
