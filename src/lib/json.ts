import fs from "node:fs/promises";
import { resolve } from "node:path";
import { __dirname, __filename } from "./utils.ts";

export const readJSON = async <T>(path: string): Promise<T> => {
  const raw = await fs.readFile(resolve(__dirname, path), {
    encoding: "utf-8",
  });
  return JSON.parse(raw) as T;
};

export const writeJSON = async (path: string, data: any) => {
  await fs.writeFile(path, data);
};

export const appendToJSON = async (path: string, data: any) => {
  const currentData = await readJSON(path);
  const isArray = Array.isArray(currentData);

  if (!isArray) return;

  currentData.push(data);
  await writeJSON(path, currentData);
};
