import { StatusError } from "@/lib/error.ts";
import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = async (err, c) => {
  if (err instanceof StatusError) {
    return c.json({ error: err.message }, err.statusCode);
  }
  return c.json({
    error: err.message,
  });
};
