import crypto from "crypto";
import { env } from "../config/env";

export type TokenRole = "CITIZEN" | "OPERATOR" | "TECHNICIAN";

export type TokenPayload = {
  id: string;
  email: string;
  role: TokenRole;
  districtId?: string | null;
  exp: number;
};

function signData(data: string) {
  return crypto.createHmac("sha256", env.JWT_SECRET).update(data).digest("base64url");
}

export function signToken(
  payload: Omit<TokenPayload, "exp">,
  expiresInDays = 7
) {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const body: TokenPayload = { ...payload, exp };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  const signature = signData(encoded);
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string): TokenPayload {
  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) {
    throw new Error("Token inválido");
  }

  const expectedSignature = signData(encoded);
  if (expectedSignature !== signature) {
    throw new Error("Firma inválida");
  }

  const payload = JSON.parse(
    Buffer.from(encoded, "base64url").toString("utf8")
  ) as TokenPayload;

  if (Date.now() > payload.exp) {
    throw new Error("Token expirado");
  }

  return payload;
}