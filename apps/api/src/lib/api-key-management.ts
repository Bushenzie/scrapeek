import crypto from "node:crypto";
import { env } from "./env";

const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256").update(env.ENCRYPT_KEY).digest();

export const generateAPIKey = () => {
  const randomPart = crypto.randomBytes(32).toString("hex");

  return `scrpk_${randomPart}`;
};

export const encryptAPIKey = (apiKey: string) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}${encrypted}`;
};

export const decryptAPIKey = (hashedApiKey: string) => {
  const ivPart = hashedApiKey.substring(0, 32);
  const encryptedPart = hashedApiKey.substring(32);

  const iv = Buffer.from(ivPart, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedPart, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
