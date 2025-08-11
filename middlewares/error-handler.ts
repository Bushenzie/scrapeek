import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = async (err, c) => {
  return c.json({ error: err.message });
};
