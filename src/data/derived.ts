import type {
  DiseaseState,
  DrugMonograph,
  DrugSearchResult,
  MonographLookupResult,
  OrganismSpecific,
  PathogenReference,
  RegimenReference,
  Subcategory,
} from "../types";
import {
  getInstitutionDrugSearchText,
  getInstitutionPathwaySearchText,
} from "./institution-profile";
import { buildRegimenCatalog, type RegimenCatalogData } from "./regimen-catalog";
import { aliasTextFor, DISEASE_ALIASES, DRUG_ALIASES, SUBCATEGORY_ALIASES } from "./search-aliases";
import {
  flattenMonographMicrobiologyText,
  flattenSubcategoryMicrobiologyText,
} from "./microbiology";
import { flattenContentMetaText } from "./metadata";
import {
  flattenMonographStructuredText,
  flattenRegimenPlan,
  flattenSubcategoryStewardshipText,
} from "./stewardship";
import { PATHOGEN_REFERENCES } from "./pathogen-references";

export type SearchEntry =
  | { type: "disease"; disease: DiseaseState; text: string }
  | { type: "pathogen"; pathogen: PathogenReference; text: string }
  | {
      type: "subcategory";
      disease: DiseaseState;
      subcategory: Subcategory;
      text: string;
      matchClassify: (query: string) => "name" | "pearl" | "workflow" | "microbiology" | "empiric";
    }
  | { type: "regimen"; disease: DiseaseState; subcategory: Subcategory; regimen: RegimenReference; text: string }
  | { type: "organism"; disease: DiseaseState; subcategory: Subcategory; organism: OrganismSpecific; text: string }
  | { type: "drug"; disease: DiseaseState; drug: DrugMonograph; text: string };

export interface CatalogDerived {
  allMonographs: Array<DrugMonograph & { parentDisease: DiseaseState }>;
  allPathogens: PathogenReference[];
  allRegimens: RegimenReference[];
  totalSubcategories: number;
  diseaseById: Record<string, DiseaseState>;
  pathogenById: Record<string, PathogenReference>;
  pathogensByDiseaseId: Record<string, PathogenReference[]>;
  pathogensByMonographId: Record<string, PathogenReference[]>;
  pathogensBySubcategoryKey: Record<string, PathogenReference[]>;
  subcategoryByDiseaseId: Record<string, Record<string, Subcategory>>;
  monographLookup: Record<string, MonographLookupResult>;
  monographXref: Record<string, DiseaseState[]>;
  regimenXref: Record<string, RegimenReference[]>;
  searchIndex: SearchEntry[];
  monographsByClass: Record<string, DrugSearchResult[]>;
  findMonograph: (drugId: string) => MonographLookupResult | null;
  findPathogen: (pathogenId: string) => PathogenReference | null;
  findPathogensForDisease: (diseaseId: string) => PathogenReference[];
  findPathogensForMonograph: (drugId: string) => PathogenReference[];
  findPathogensForSubcategory: (diseaseId: string, subcategoryId: string) => PathogenReference[];
}

function getEmpiricTherapy(subcategory: Subcategory) {
  return subcategory.empiricTherapy ?? subcategory.empiricRegimens ?? [];
}

function workflowQueryMatch(values: string[], query: string) {
  const lowerQuery = query.toLowerCase();
  const tokens = lowerQuery
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !["vs", "and", "or", "the", "for", "with", "to"].includes(token));
  return values.some((value) => {
    const lowerValue = value.toLowerCase();
    return lowerValue.includes(lowerQuery) || (tokens.length > 0 && tokens.every((token) => lowerValue.includes(token)));
  });
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

export function buildCatalogDerived(diseases: DiseaseState[], regimenCatalog?: RegimenCatalogData): CatalogDerived {
  const resolvedRegimenCatalog = regimenCatalog ?? buildRegimenCatalog(diseases);
  const seen = new Set<string>();
  const allMonographs: Array<DrugMonograph & { parentDisease: DiseaseState }> = [];
  const allPathogens = PATHOGEN_REFERENCES.slice();
  const allRegimens = resolvedRegimenCatalog.regimens.slice();
  const diseaseById: Record<string, DiseaseState> = Object.fromEntries(diseases.map((disease) => [disease.id, disease]));
  const pathogenById: Record<string, PathogenReference> = Object.fromEntries(
    PATHOGEN_REFERENCES.map((pathogen) => [pathogen.id, pathogen]),
  );
  const pathogensByDiseaseId: Record<string, PathogenReference[]> = {};
  const pathogensByMonographId: Record<string, PathogenReference[]> = {};
  const pathogensBySubcategoryKey: Record<string, PathogenReference[]> = {};
  const subcategoryByDiseaseId: Record<string, Record<string, Subcategory>> = Object.fromEntries(
    diseases.map((disease) => [
      disease.id,
      Object.fromEntries(disease.subcategories.map((subcategory) => [subcategory.id, subcategory])),
    ]),
  );
  const monographXref: Record<string, DiseaseState[]> = {};
  const regimenXref: Record<string, RegimenReference[]> = Object.fromEntries(
    Object.entries(resolvedRegimenCatalog.xrefByMonographId).map(([monographId, regimens]) => [monographId, regimens.slice()]),
  );
  const searchIndex: SearchEntry[] = [];

  PATHOGEN_REFERENCES.forEach((pathogen) => {
    [...new Set((pathogen.relatedPathways ?? []).map((pathway) => pathway.diseaseId))].forEach((diseaseId) => {
      (pathogensByDiseaseId[diseaseId] ??= []).push(pathogen);
    });

    (pathogen.relatedPathways ?? []).forEach((pathway) => {
      if (!pathway.subcategoryId) return;
      (pathogensBySubcategoryKey[`${pathway.diseaseId}/${pathway.subcategoryId}`] ??= []).push(pathogen);
    });

    const relatedMonographIds = new Set<string>([
      ...(pathogen.linkedMonographIds ?? []),
      ...pathogen.preferredTherapyBySite.flatMap((entry) => entry.linkedMonographIds ?? []),
      ...(pathogen.breakpointRules?.flatMap((entry) => entry.linkedMonographIds ?? []) ?? []),
    ]);
    relatedMonographIds.forEach((monographId) => {
      (pathogensByMonographId[monographId] ??= []).push(pathogen);
    });

    searchIndex.push({
      type: "pathogen",
      pathogen,
      text: [
        pathogen.name,
        pathogen.phenotype,
        pathogen.summary,
        ...pathogen.likelySyndromes,
        ...pathogen.rapidDiagnosticInterpretation.flatMap((entry) => [entry.title, entry.detail, entry.note ?? ""]),
        ...pathogen.contaminationPitfalls.flatMap((entry) => [entry.scenario, entry.implication, entry.action]),
        ...pathogen.resistanceMechanisms.flatMap((entry) => [entry.title, entry.detail, entry.note ?? ""]),
        ...pathogen.breakpointCaveats.flatMap((entry) => [entry.title, entry.detail, entry.note ?? ""]),
        ...pathogen.preferredTherapyBySite.flatMap((entry) => [
          entry.site,
          entry.preferred,
          entry.rationale,
          ...(entry.alternatives ?? []),
          ...(entry.avoid ?? []),
          ...(entry.linkedMonographIds ?? []),
        ]),
        ...(pathogen.breakpointRules?.flatMap((rule) => [
          rule.title,
          rule.detail,
          ...(rule.site ?? []),
          ...(rule.interpretation ?? []),
          ...(rule.rapidDiagnostic ?? []),
          ...(rule.linkedMonographIds ?? []),
        ]) ?? []),
        ...(pathogen.relatedPathways?.map((pathway) => pathway.label) ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  });

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
      text: [
        disease.name,
        disease.overview.definition,
        disease.category,
        aliasTextFor(DISEASE_ALIASES, disease.id),
        ...flattenContentMetaText(disease.contentMeta),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });

    disease.subcategories.forEach((subcategory) => {
      const searchTexts = [subcategory.name, subcategory.definition, aliasTextFor(SUBCATEGORY_ALIASES, subcategory.id), ...(subcategory.pearls ?? [])];
      searchTexts.push(...flattenSubcategoryStewardshipText(subcategory));
      searchTexts.push(...flattenSubcategoryMicrobiologyText(subcategory));
      searchTexts.push(...flattenContentMetaText(subcategory.contentMeta));
      searchTexts.push(...getInstitutionPathwaySearchText(disease.id, subcategory.id));

      getEmpiricTherapy(subcategory).forEach((tier) => {
        searchTexts.push(tier.line);
        tier.options.forEach((option) => {
          searchTexts.push(option.plan?.regimen ?? option.regimen);
          searchTexts.push(option.plan?.rationale ?? option.notes ?? "");
          searchTexts.push(...flattenRegimenPlan(option.plan));
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
          if (workflowQueryMatch(flattenSubcategoryMicrobiologyText(subcategory), query)) {
            return "microbiology";
          }
          if (workflowQueryMatch(flattenSubcategoryStewardshipText(subcategory), query)) {
            return "workflow";
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
          ...flattenMonographStructuredText(drug),
          ...flattenMonographMicrobiologyText(drug),
          ...flattenContentMetaText(drug.contentMeta),
          ...getInstitutionDrugSearchText(drug.id),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      });
    });
  });

  allMonographs.sort((left, right) => left.name.localeCompare(right.name));

  allRegimens.forEach((regimen) => {
    const disease = diseaseById[regimen.diseaseId];
    const subcategory = subcategoryByDiseaseId[regimen.diseaseId]?.[regimen.subcategoryId];
    if (!disease || !subcategory) return;

    searchIndex.push({
      type: "regimen",
      disease,
      subcategory,
      regimen,
      text: [
        regimen.regimen,
        regimen.notes,
        regimen.line,
        regimen.indication,
        regimen.site,
        regimen.role,
        ...(regimen.pathogenFocus ?? []),
        ...(regimen.riskFactorTriggers ?? []),
        ...(regimen.avoidIf ?? []),
        ...(regimen.renalFlags ?? []),
        ...(regimen.dialysisFlags ?? []),
        ...(regimen.rapidDiagnosticActions ?? []),
        ...(regimen.linkedMonographIds ?? []),
        regimen.subcategoryName,
        regimen.diseaseName,
        regimen.drug,
        regimen.monographId,
        regimen.evidence,
        regimen.evidenceSource,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  });

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
    allPathogens,
    allRegimens,
    totalSubcategories: diseases.reduce((count, disease) => count + disease.subcategories.length, 0),
    diseaseById,
    pathogenById,
    pathogensByDiseaseId,
    pathogensByMonographId,
    pathogensBySubcategoryKey,
    subcategoryByDiseaseId,
    monographLookup,
    monographXref,
    regimenXref,
    searchIndex,
    monographsByClass,
    findMonograph: (drugId: string) => monographLookup[drugId] ?? null,
    findPathogen: (pathogenId: string) => pathogenById[pathogenId] ?? null,
    findPathogensForDisease: (diseaseId: string) => pathogensByDiseaseId[diseaseId] ?? [],
    findPathogensForMonograph: (drugId: string) => pathogensByMonographId[drugId] ?? [],
    findPathogensForSubcategory: (diseaseId: string, subcategoryId: string) =>
      pathogensBySubcategoryKey[`${diseaseId}/${subcategoryId}`] ?? [],
  };
}
