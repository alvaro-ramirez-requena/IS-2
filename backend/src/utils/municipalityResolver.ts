export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function resolveMunicipalityNameFromLocation(data: {
  district?: string | null;
  province?: string | null;
  department?: string | null;
  address?: string | null;
}) {
  const district = data.district ? normalizeText(data.district) : "";

  const province = data.province ? normalizeText(data.province) : "";

  const department = data.department ? normalizeText(data.department) : "";

  const address = data.address ? normalizeText(data.address) : "";

  const fullText = `${district} ${province} ${department} ${address}`;

  if (
    province === "callao" ||
    department === "callao" ||
    fullText.includes("callao") ||
    fullText.includes("bellavista") ||
    fullText.includes("la perla") ||
    fullText.includes("la punta") ||
    fullText.includes("carmen de la legua") ||
    fullText.includes("ventanilla") ||
    fullText.includes("mi peru")
  ) {
    return "Municipalidad Provincial del Callao";
  }

  if (
    district.includes("santiago de surco") ||
    fullText.includes("santiago de surco") ||
    fullText.includes("surco")
  ) {
    return "Municipalidad de Santiago de Surco";
  }

  if (district.includes("miraflores") || fullText.includes("miraflores")) {
    return "Municipalidad de Miraflores";
  }

  if (district.includes("san isidro") || fullText.includes("san isidro")) {
    return "Municipalidad de San Isidro";
  }

  if (district.includes("lince") || fullText.includes("lince")) {
    return "Municipalidad de Lince";
  }

  if (district.includes("san borja") || fullText.includes("san borja")) {
    return "Municipalidad de San Borja";
  }

  if (district.includes("la molina") || fullText.includes("la molina")) {
    return "Municipalidad de La Molina";
  }

  return null;
}
