import { prisma } from "../config/prisma";

export type MunicipalityLocationData = {
  district?: string | null;
  province?: string | null;
  department?: string | null;
  address?: string | null;
  searchText?: string | null;
};

export function normalizeText(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function simplifyMunicipalityName(name?: string | null) {
  return normalizeText(name)
    .replace("municipalidad provincial del ", "")
    .replace("municipalidad provincial de ", "")
    .replace("municipalidad distrital del ", "")
    .replace("municipalidad distrital de ", "")
    .replace("municipalidad de ", "")
    .replace("municipalidad del ", "")
    .trim();
}

function calculateMatchScore(
  locationData: MunicipalityLocationData,
  municipality: {
    name: string;
    district?: string | null;
    province?: string | null;
    department?: string | null;
    aliases?: string[];
  }
) {
  const district =
    normalizeText(locationData.district);

  const province =
    normalizeText(locationData.province);

  const department =
    normalizeText(locationData.department);

  const address =
    normalizeText(locationData.address);

  const searchText =
    normalizeText(locationData.searchText);

  const fullText =
    normalizeText(
      `${district} ${province} ${department} ${address} ${searchText}`
    );

  const municipalityName =
    normalizeText(municipality.name);

  const municipalityDistrict =
    normalizeText(municipality.district);

  const municipalityProvince =
    normalizeText(municipality.province);

  const municipalityDepartment =
    normalizeText(municipality.department);

  const simplifiedName =
    simplifyMunicipalityName(municipality.name);

  const aliases =
    municipality.aliases || [];

  let score =
    0;

  if (
    municipalityDistrict &&
    fullText.includes(municipalityDistrict)
  ) {
    score += 120;
  }

  if (
    district &&
    municipalityDistrict &&
    district === municipalityDistrict
  ) {
    score += 100;
  }

  if (
    district &&
    municipalityDistrict &&
    (
      district.includes(municipalityDistrict) ||
      municipalityDistrict.includes(district)
    )
  ) {
    score += 80;
  }

  if (
    simplifiedName &&
    simplifiedName.length >= 4 &&
    fullText.includes(simplifiedName)
  ) {
    score += 70;
  }

  if (
    municipalityName &&
    fullText.includes(municipalityName)
  ) {
    score += 60;
  }

  for (const alias of aliases) {
    const normalizedAlias =
      normalizeText(alias);

    if (
      normalizedAlias &&
      normalizedAlias.length >= 3 &&
      fullText.includes(normalizedAlias)
    ) {
      score += 150;
    }
  }

  if (
    province &&
    municipalityProvince &&
    province === municipalityProvince
  ) {
    score += 10;
  }

  if (
    department &&
    municipalityDepartment &&
    department === municipalityDepartment
  ) {
    score += 10;
  }

  return score;
}

export async function resolveMunicipalityIdFromLocation(
  locationData: MunicipalityLocationData
) {
  const municipalities =
    await prisma.municipality.findMany();

  let bestMatch:
    | {
        id: string;
        score: number;
      }
    | null =
    null;

  for (const municipality of municipalities) {
    const score =
      calculateMatchScore(
        locationData,
        municipality
      );

    if (
      !bestMatch ||
      score > bestMatch.score
    ) {
      bestMatch = {
        id:
          municipality.id,

        score,
      };
    }
  }

  if (
    !bestMatch ||
    bestMatch.score < 50
  ) {
    return undefined;
  }

  return bestMatch.id;
}