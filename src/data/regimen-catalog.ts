import type { DiseaseState, RegimenReference, Subcategory } from "../types";
import { getPreferredRegimenNotes, getPreferredRegimenText } from "./stewardship";

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

function getRegimenMonographIds(regimen: RegimenReference) {
  return [...new Set([regimen.monographId, ...(regimen.linkedMonographIds ?? [])].filter(Boolean))] as string[];
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
            regimen: getPreferredRegimenText(option.regimen, option.plan),
            ...(getPreferredRegimenNotes(option.notes, option.plan) ? { notes: getPreferredRegimenNotes(option.notes, option.plan) } : {}),
            ...(option.plan?.indication ? { indication: option.plan.indication } : {}),
            ...(option.plan?.site ? { site: option.plan.site } : {}),
            ...(option.plan?.role ? { role: option.plan.role } : {}),
            ...(option.plan?.pathogenFocus?.length ? { pathogenFocus: option.plan.pathogenFocus } : {}),
            ...(option.plan?.riskFactorTriggers?.length ? { riskFactorTriggers: option.plan.riskFactorTriggers } : {}),
            ...(option.plan?.avoidIf?.length ? { avoidIf: option.plan.avoidIf } : {}),
            ...(option.plan?.renalFlags?.length ? { renalFlags: option.plan.renalFlags } : {}),
            ...(option.plan?.dialysisFlags?.length ? { dialysisFlags: option.plan.dialysisFlags } : {}),
            ...(option.plan?.rapidDiagnosticActions?.length
              ? { rapidDiagnosticActions: option.plan.rapidDiagnosticActions }
              : {}),
            ...(option.plan?.linkedMonographIds?.length ? { linkedMonographIds: option.plan.linkedMonographIds } : {}),
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
    getRegimenMonographIds(regimen).forEach((monographId) => {
      (xrefByMonographId[monographId] ??= []).push(regimen);
    });
  });

  return {
    regimens,
    xrefByMonographId,
  };
}
