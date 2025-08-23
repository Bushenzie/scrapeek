import type { ErrorHandler } from "hono";
import { StatusError } from "@/lib/error.ts";

export const errorHandler: ErrorHandler = async (err, c) => {
  if (err instanceof StatusError) {
    return c.json({ error: err.message }, err.statusCode);
  }
  return c.json({
    error: err.message,
  });
};
