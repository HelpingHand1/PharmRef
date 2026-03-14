import type { DiseaseState, DrugMonograph, Subcategory } from "../types";

type JsonLike =
  | null
  | string
  | number
  | boolean
  | JsonLike[]
  | { [key: string]: JsonLike };

function normalizeValue(value: unknown): JsonLike {
  if (value === undefined) {
    return null;
  }

  if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  const objectValue = value as Record<string, unknown>;
  const sortedEntries = Object.entries(objectValue)
    .filter(([key]) => key !== "contentMeta")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, nestedValue]) => [key, normalizeValue(nestedValue)]);

  return Object.fromEntries(sortedEntries) as JsonLike;
}

function stableSerialize(value: unknown) {
  return JSON.stringify(normalizeValue(value));
}

function fnv1aHash(input: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function fingerprint(value: unknown) {
  return fnv1aHash(stableSerialize(value));
}

export function computeDiseaseOverviewFingerprint(disease: DiseaseState) {
  return fingerprint({
    id: disease.id,
    name: disease.name,
    icon: disease.icon,
    category: disease.category,
    overview: disease.overview,
  });
}

export function getSubcategoryContentKey(diseaseId: string, subcategoryId: string) {
  return `${diseaseId}/${subcategoryId}`;
}

export function getMonographContentKey(diseaseId: string, monographId: string) {
  return `${diseaseId}/${monographId}`;
}

export function computeSubcategoryFingerprint(subcategory: Subcategory) {
  return fingerprint(subcategory);
}

export function computeMonographFingerprint(monograph: DrugMonograph) {
  return fingerprint(monograph);
}

export function buildContentApprovalFingerprintMap(diseaseStates: DiseaseState[]) {
  const entries: Array<[string, string]> = [];

  diseaseStates.forEach((disease) => {
    entries.push([disease.id, computeDiseaseOverviewFingerprint(disease)]);

    disease.subcategories.forEach((subcategory) => {
      entries.push([getSubcategoryContentKey(disease.id, subcategory.id), computeSubcategoryFingerprint(subcategory)]);
    });

    disease.drugMonographs.forEach((monograph) => {
      entries.push([getMonographContentKey(disease.id, monograph.id), computeMonographFingerprint(monograph)]);
    });
  });

  return Object.fromEntries(entries.sort(([left], [right]) => left.localeCompare(right)));
}
