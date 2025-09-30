import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db";
import { apiKeysTable } from "@/db/schemas/api-keys";
import {
  decryptAPIKey,
  encryptAPIKey,
  generateAPIKey,
} from "@/lib/api-key-management";
import type { AuthType } from "@/lib/auth";
import { StatusError } from "@/lib/error";
import { authMiddleware } from "@/middlewares/auth-middleware";

const app = new Hono<{ Variables: AuthType }>()
  .use(authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("Unauthorized", 401);
    }

    const foundApiKey = await db.query.apiKeysTable.findFirst({
      where: eq(apiKeysTable.userId, user.id),
    });

    if (!foundApiKey) {
      throw new StatusError("No API Key found", 404);
    }

    const decryptedApiKey = decryptAPIKey(foundApiKey?.key);

    return c.json({
      key: decryptedApiKey,
    });
  })
  .post("/", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("Unauthorized", 401);
    }

    const existingApiKey = await db.query.apiKeysTable.findFirst({
      where: eq(apiKeysTable.userId, user.id),
    });

    if (existingApiKey?.active) {
      await db.update(apiKeysTable).set({
        active: false,
      });
    }

    const newApiKey = generateAPIKey();

    const encryptedAPIKey = encryptAPIKey(newApiKey);

    await db.insert(apiKeysTable).values({
      key: encryptedAPIKey,
      userId: user.id,
    });

    return c.json({
      key: newApiKey,
    });
  });

export default app;
