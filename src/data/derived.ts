import type {
  DiseaseState,
  DrugMonograph,
  DrugSearchResult,
  MonographLookupResult,
  OrganismSpecific,
  Subcategory,
} from "../types";
import { aliasTextFor, DISEASE_ALIASES, DRUG_ALIASES, SUBCATEGORY_ALIASES } from "./search-aliases";

export type SearchEntry =
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

export interface CatalogDerived {
  allMonographs: Array<DrugMonograph & { parentDisease: DiseaseState }>;
  totalSubcategories: number;
  diseaseById: Record<string, DiseaseState>;
  subcategoryByDiseaseId: Record<string, Record<string, Subcategory>>;
  monographLookup: Record<string, MonographLookupResult>;
  monographXref: Record<string, DiseaseState[]>;
  searchIndex: SearchEntry[];
  monographsByClass: Record<string, DrugSearchResult[]>;
  findMonograph: (drugId: string) => MonographLookupResult | null;
}

export const CLASS_GROUPS: Array<{ label: string; keywords: string[] }> = [
  { label: "Penicillins",                keywords: ["aminopenicillin", "anti-staphylococcal penicillin", "extended-spectrum penicillin"] },
  { label: "Cephalosporins",             keywords: ["cephalosporin"] },
  { label: "Carbapenems",                keywords: ["carbapenem"] },
  { label: "β-Lactam Combinations",      keywords: ["beta-lactamase inhibitor", "monobactam"] },
  { label: "Fluoroquinolones",           keywords: ["fluoroquinolone"] },
  { label: "Aminoglycosides",            keywords: ["aminoglycoside"] },
  { label: "Glycopeptides",              keywords: ["glycopeptide"] },
  { label: "Oxazolidinones",             keywords: ["oxazolidinone"] },
  { label: "Cyclic Lipopeptides",        keywords: ["cyclic lipopeptide"] },
  { label: "Macrolides & Tetracyclines", keywords: ["macrolide", "tetracycline"] },
  { label: "Nitroimidazoles",            keywords: ["nitroimidazole"] },
  { label: "Azoles",                     keywords: ["triazole", "azole"] },
  { label: "Echinocandins",              keywords: ["echinocandin"] },
  { label: "Polyenes",                   keywords: ["polyene"] },
  { label: "Other",                      keywords: [] },
];

export function getDrugClassGroup(drugClass: string): string {
  const lower = drugClass.toLowerCase();
  for (const g of CLASS_GROUPS) {
    if (g.keywords.length && g.keywords.some((kw) => lower.includes(kw))) return g.label;
  }
  return "Other";
}

export function groupMonographsByClass<T extends { drugClass: string }>(monographs: T[]): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  monographs.forEach((monograph) => {
    const group = getDrugClassGroup(monograph.drugClass);
    (map[group] ??= []).push(monograph);
  });
  return map;
}

export function buildCatalogDerived(diseases: DiseaseState[]): CatalogDerived {
  const seen = new Set<string>();
  const allMonographs: Array<DrugMonograph & { parentDisease: DiseaseState }> = [];
  const diseaseById: Record<string, DiseaseState> = Object.fromEntries(diseases.map((disease) => [disease.id, disease]));
  const subcategoryByDiseaseId: Record<string, Record<string, Subcategory>> = Object.fromEntries(
    diseases.map((disease) => [
      disease.id,
      Object.fromEntries(disease.subcategories.map((subcategory) => [subcategory.id, subcategory])),
    ]),
  );
  const monographXref: Record<string, DiseaseState[]> = {};
  const searchIndex: SearchEntry[] = [];

  diseases.forEach((disease) => {
    disease.drugMonographs.forEach((monograph) => {
      monographXref[monograph.id] ??= [];
      monographXref[monograph.id].push(disease);

      if (seen.has(monograph.id)) return;
      seen.add(monograph.id);
      allMonographs.push({ ...monograph, parentDisease: disease });
    });

    searchIndex.push({
      type: "disease",
      disease,
      text: [disease.name, disease.overview.definition, disease.category, aliasTextFor(DISEASE_ALIASES, disease.id)].filter(Boolean).join(" ").toLowerCase(),
    });

    disease.subcategories.forEach((subcategory) => {
      const searchTexts = [subcategory.name, subcategory.definition, aliasTextFor(SUBCATEGORY_ALIASES, subcategory.id), ...(subcategory.pearls ?? [])];

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

      searchIndex.push({
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
        searchIndex.push({
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
      searchIndex.push({
        type: "drug",
        disease,
        drug,
        text: [
          drug.name,
          drug.brandNames,
          drug.drugClass,
          drug.spectrum,
          drug.mechanismOfAction,
          aliasTextFor(DRUG_ALIASES, drug.id),
          ...(drug.pharmacistPearls ?? []),
          ...(drug.drugInteractions ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      });
    });
  });

  allMonographs.sort((left, right) => left.name.localeCompare(right.name));

  const monographLookup: Record<string, MonographLookupResult> = Object.fromEntries(
    allMonographs.map((monograph) => [
      monograph.id,
      {
        disease: monograph.parentDisease,
        monograph,
      },
    ]),
  );

  const monographsByClass = groupMonographsByClass(allMonographs);

  return {
    allMonographs,
    totalSubcategories: diseases.reduce((count, disease) => count + disease.subcategories.length, 0),
    diseaseById,
    subcategoryByDiseaseId,
    monographLookup,
    monographXref,
    searchIndex,
    monographsByClass,
    findMonograph: (drugId: string) => monographLookup[drugId] ?? null,
  };
}
