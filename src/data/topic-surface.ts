import type { DiseaseState, EmpiricTier, Subcategory } from "../types";

export type TopicSurfaceMode = NonNullable<DiseaseState["surfaceMode"]>;

export function getTopicSurfaceMode(
  topic?: Pick<DiseaseState, "surfaceMode"> | null,
): TopicSurfaceMode {
  return topic?.surfaceMode ?? "infectious-disease";
}

export function isGeneralPharmacyTopic(
  topic?: Pick<DiseaseState, "surfaceMode"> | null,
) {
  return getTopicSurfaceMode(topic) === "general-pharmacy";
}

export function showsInfectiousDetail(
  topic?: Pick<DiseaseState, "surfaceMode"> | null,
) {
  return !isGeneralPharmacyTopic(topic);
}

export function getTreatmentTiers(
  subcategory: Pick<Subcategory, "treatmentApproach" | "empiricTherapy" | "empiricRegimens">,
): EmpiricTier[] {
  return (
    subcategory.treatmentApproach ??
    subcategory.empiricTherapy ??
    subcategory.empiricRegimens ??
    []
  );
}

export function getCatalogCollectionLabel() {
  return "Clinical Topics";
}

export function getTopicOverviewLabel() {
  return "Topic Overview";
}

export function getPathwayCollectionLabel() {
  return "Care Pathways";
}

export function getTreatmentSummaryLabel(
  topic?: Pick<DiseaseState, "surfaceMode"> | null,
) {
  return isGeneralPharmacyTopic(topic) ? "Treatment Tiers" : "Empiric Tiers";
}

export function getTreatmentSectionTitle(
  subcategory: Pick<Subcategory, "treatmentApproach" | "empiricTherapy" | "empiricRegimens">,
  topic?: Pick<DiseaseState, "surfaceMode"> | null,
) {
  if (isGeneralPharmacyTopic(topic)) {
    return "Treatment Approach";
  }

  return getTreatmentTiers(subcategory).some((tier) => {
    const line = tier.line.toLowerCase();
    return line.includes("prevention") || line.includes("stewardship");
  })
    ? "Interventions & Protocols"
    : "Empiric Therapy";
}
