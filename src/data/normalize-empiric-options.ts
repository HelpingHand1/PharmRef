import type { DiseaseState, EmpiricOption } from "../types";
import { resolveEvidenceSourceText } from "./source-registry";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function buildEmpiricOptionId(
  diseaseId: string,
  subcategoryId: string,
  tierLine: string,
  option: EmpiricOption,
  optionIndex: number,
) {
  const label = option.monographId ?? option.drug ?? option.regimen;
  return `${diseaseId}/${subcategoryId}/${slugify(tierLine) || "tier"}/${slugify(label) || "option"}-${optionIndex + 1}`;
}

export function normalizeDiseaseEmpiricOptions(
  disease: DiseaseState,
  knownMonographIds: Set<string>,
): DiseaseState {
  const normalizeTierOptions = (subcategoryId: string, tiers: DiseaseState["subcategories"][number]["empiricTherapy"]) =>
    tiers?.map((tier) => ({
      ...tier,
      options: tier.options.map((option, optionIndex) => {
        const { evidenceSourceIds: authoredEvidenceSourceIds, monographId: authoredMonographId, ...rest } = option;
        const monographId =
          authoredMonographId ?? (option.drug && knownMonographIds.has(option.drug) ? option.drug : undefined);
        const evidenceSourceIds =
          authoredEvidenceSourceIds ?? resolveEvidenceSourceText(option.evidenceSource).map((source) => source.id);
        const shouldIncludeEvidenceSourceIds =
          Boolean(option.evidenceSource) || Boolean(authoredEvidenceSourceIds) || evidenceSourceIds.length > 0;

        return {
          ...rest,
          ...(monographId ? { monographId } : {}),
          ...(shouldIncludeEvidenceSourceIds ? { evidenceSourceIds } : {}),
          id: option.id ?? buildEmpiricOptionId(disease.id, subcategoryId, tier.line, { ...option, monographId }, optionIndex),
        };
      }),
    }));

  return {
    ...disease,
    subcategories: disease.subcategories.map((subcategory) => {
      const empiricTherapy = normalizeTierOptions(subcategory.id, subcategory.empiricTherapy);
      const empiricRegimens = normalizeTierOptions(subcategory.id, subcategory.empiricRegimens);

      return {
        ...subcategory,
        ...(empiricTherapy ? { empiricTherapy } : {}),
        ...(empiricRegimens ? { empiricRegimens } : {}),
      };
    }),
  };
}
