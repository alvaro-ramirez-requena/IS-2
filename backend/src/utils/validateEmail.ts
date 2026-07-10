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

  // Dominios conocidos que siempre se aceptan sin consulta DNS
  const trustedDomains = [
    "gmail.com", "hotmail.com", "outlook.com", "yahoo.com",
    "ulima.edu.pe", "aloe.ulima.edu.pe", "live.com", "icloud.com"
  ];

  if (trustedDomains.includes(domain.toLowerCase())) {
    return true;
  }

  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}