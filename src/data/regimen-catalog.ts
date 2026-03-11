import type { DiseaseState, RegimenReference, Subcategory } from "../types";

export interface RegimenCatalogData {
  regimens: RegimenReference[];
  xrefByMonographId: Record<string, RegimenReference[]>;
}

function getEmpiricTherapy(subcategory: Subcategory) {
  return subcategory.empiricTherapy ?? subcategory.empiricRegimens ?? [];
}

function sortRegimenReferences(left: RegimenReference, right: RegimenReference) {
  if (left.diseaseName !== right.diseaseName) return left.diseaseName.localeCompare(right.diseaseName);
  if (left.subcategoryName !== right.subcategoryName) return left.subcategoryName.localeCompare(right.subcategoryName);
  if (left.line !== right.line) return left.line.localeCompare(right.line);
  return left.regimen.localeCompare(right.regimen);
}

export function buildRegimenCatalog(diseases: DiseaseState[]): RegimenCatalogData {
  const regimens: RegimenReference[] = [];

  diseases.forEach((disease) => {
    disease.subcategories.forEach((subcategory) => {
      getEmpiricTherapy(subcategory).forEach((tier) => {
        tier.options.forEach((option) => {
          if (!option.id) return;

          regimens.push({
            id: option.id,
            diseaseId: disease.id,
            diseaseName: disease.name,
            diseaseIcon: disease.icon,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            line: tier.line,
            regimen: option.regimen,
            ...(option.notes ? { notes: option.notes } : {}),
            ...(option.drug ? { drug: option.drug } : {}),
            ...(option.monographId ? { monographId: option.monographId } : {}),
            ...(option.evidence ? { evidence: option.evidence } : {}),
            ...(option.evidenceSource ? { evidenceSource: option.evidenceSource } : {}),
            ...(option.evidenceSourceIds ? { evidenceSourceIds: option.evidenceSourceIds } : {}),
          });
        });
      });
    });
  });

  regimens.sort(sortRegimenReferences);

  const xrefByMonographId: Record<string, RegimenReference[]> = {};
  regimens.forEach((regimen) => {
    if (!regimen.monographId) return;
    (xrefByMonographId[regimen.monographId] ??= []).push(regimen);
  });

  return {
    regimens,
    xrefByMonographId,
  };
}
