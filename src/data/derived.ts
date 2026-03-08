import type {
  DiseaseState,
  DrugMonograph,
  MonographLookupResult,
  OrganismSpecific,
  Subcategory,
} from "../types";
import { DISEASE_STATES } from "./index";

type SearchEntry =
  | { type: "disease"; disease: DiseaseState; text: string }
  | {
      type: "subcategory";
      disease: DiseaseState;
      subcategory: Subcategory;
      text: string;
      matchClassify: (query: string) => "name" | "pearl" | "empiric";
    }
  | { type: "organism"; disease: DiseaseState; subcategory: Subcategory; organism: OrganismSpecific; text: string }
  | { type: "drug"; disease: DiseaseState; drug: DrugMonograph; text: string };

export const ALL_MONOGRAPHS: Array<DrugMonograph & { parentDisease: DiseaseState }> = (() => {
  const seen = new Set<string>();
  const list: Array<DrugMonograph & { parentDisease: DiseaseState }> = [];

  DISEASE_STATES.forEach((disease) => {
    disease.drugMonographs.forEach((monograph) => {
      if (seen.has(monograph.id)) return;
      seen.add(monograph.id);
      list.push({ ...monograph, parentDisease: disease });
    });
  });

  return list.sort((left, right) => left.name.localeCompare(right.name));
})();

export const TOTAL_SUBCATEGORIES = DISEASE_STATES.reduce((count, disease) => count + disease.subcategories.length, 0);

export const DISEASE_BY_ID: Record<string, DiseaseState> = Object.fromEntries(
  DISEASE_STATES.map((disease) => [disease.id, disease]),
);

export const SUBCATEGORY_BY_DISEASE_ID: Record<string, Record<string, Subcategory>> = Object.fromEntries(
  DISEASE_STATES.map((disease) => [
    disease.id,
    Object.fromEntries(disease.subcategories.map((subcategory) => [subcategory.id, subcategory])),
  ]),
);

export const MONOGRAPH_LOOKUP: Record<string, MonographLookupResult> = Object.fromEntries(
  ALL_MONOGRAPHS.map((monograph) => [
    monograph.id,
    {
      disease: monograph.parentDisease,
      monograph,
    },
  ]),
);

export const MONOGRAPH_XREF: Record<string, DiseaseState[]> = (() => {
  const lookup: Record<string, DiseaseState[]> = {};

  DISEASE_STATES.forEach((disease) => {
    disease.drugMonographs.forEach((monograph) => {
      lookup[monograph.id] ??= [];
      lookup[monograph.id].push(disease);
    });
  });

  return lookup;
})();

export const SEARCH_INDEX: SearchEntry[] = (() => {
  const entries: SearchEntry[] = [];

  DISEASE_STATES.forEach((disease) => {
    entries.push({
      type: "disease",
      disease,
      text: [disease.name, disease.overview.definition, disease.category].filter(Boolean).join(" ").toLowerCase(),
    });

    disease.subcategories.forEach((subcategory) => {
      const searchTexts = [subcategory.name, subcategory.definition, ...(subcategory.pearls ?? [])];

      subcategory.empiricTherapy?.forEach((tier) => {
        searchTexts.push(tier.line);
        tier.options.forEach((option) => {
          searchTexts.push(option.regimen);
          searchTexts.push(option.notes ?? "");
        });
      });

      subcategory.organismSpecific?.forEach((organism) => {
        searchTexts.push(organism.organism, organism.notes ?? "", organism.preferred ?? "", organism.alternative ?? "");
      });

      entries.push({
        type: "subcategory",
        disease,
        subcategory,
        text: searchTexts.filter(Boolean).join(" ").toLowerCase(),
        matchClassify: (query) => {
          if (subcategory.name.toLowerCase().includes(query) || subcategory.definition.toLowerCase().includes(query)) {
            return "name";
          }
          if (subcategory.pearls?.some((pearl) => pearl.toLowerCase().includes(query))) {
            return "pearl";
          }
          return "empiric";
        },
      });

      subcategory.organismSpecific?.forEach((organism) => {
        entries.push({
          type: "organism",
          disease,
          subcategory,
          organism,
          text: [organism.organism, organism.preferred, organism.alternative, organism.notes]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        });
      });
    });

    disease.drugMonographs.forEach((drug) => {
      entries.push({
        type: "drug",
        disease,
        drug,
        text: [
          drug.name,
          drug.brandNames,
          drug.drugClass,
          drug.spectrum,
          drug.mechanismOfAction,
          ...(drug.pharmacistPearls ?? []),
          ...(drug.drugInteractions ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      });
    });
  });

  return entries;
})();

export function findMonograph(drugId: string): MonographLookupResult | null {
  return MONOGRAPH_LOOKUP[drugId] ?? null;
}
