import crypto from "crypto";

export function generateEmailToken() {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  return {
    token,
    hashedToken,
  };
}

export function hashEmailToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
