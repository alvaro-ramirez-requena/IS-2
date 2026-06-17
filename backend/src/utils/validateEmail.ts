import dns from "dns/promises";

export function isValidEmailFormat(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export async function hasValidEmailDomain(email: string) {
  const domain = email.split("@")[1];

  if (!domain) {
    return false;
  }

  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}