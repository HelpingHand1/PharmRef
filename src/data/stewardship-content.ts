import type { DiseaseState, DrugMonograph, EmpiricOption, Subcategory, WorkflowBlock } from "../types";
import { getEmpiricOptionContentKey } from "./stewardship";

export function ready(summary: string, bullets: string[] = []): WorkflowBlock {
  return {
    status: "ready",
    summary,
    ...(bullets.length ? { bullets } : {}),
  };
}

export function notApplicable(summary = "Not a primary stewardship decision point for this pathway."): WorkflowBlock {
  return {
    status: "not_applicable",
    summary,
  };
}

export function enhanceDisease(
  disease: DiseaseState,
  subcategoryEnhancements: Record<string, Partial<Subcategory>>,
  monographEnhancements: Record<string, Partial<DrugMonograph>> = {},
): DiseaseState {
  return {
    ...disease,
    subcategories: disease.subcategories.map((subcategory) => ({
      ...subcategory,
      ...(subcategoryEnhancements[subcategory.id] ?? {}),
    })),
    drugMonographs: disease.drugMonographs.map((monograph) => ({
      ...monograph,
      ...(monographEnhancements[monograph.id] ?? {}),
    })),
  };
}

export function mergeEnhancementMaps<T>(...maps: Array<Record<string, Partial<T>>>): Record<string, Partial<T>> {
  return maps.reduce<Record<string, Partial<T>>>((acc, map) => {
    Object.entries(map).forEach(([key, value]) => {
      acc[key] = acc[key] ? { ...acc[key], ...value } : { ...value };
    });
    return acc;
  }, {});
}

export type EmpiricOptionEnhancementMap = Record<
  string,
  Record<string, Record<string, Partial<EmpiricOption>>>
>;

export function enhanceDiseaseEmpiricOptions(
  disease: DiseaseState,
  optionEnhancements: EmpiricOptionEnhancementMap = {},
): DiseaseState {
  return {
    ...disease,
    subcategories: disease.subcategories.map((subcategory) => {
      const tiers = subcategory.empiricTherapy ?? subcategory.empiricRegimens;
      const subcategoryEnhancements = optionEnhancements[subcategory.id];

      if (!tiers || !subcategoryEnhancements) {
        return subcategory;
      }

      const updatedTiers = tiers.map((tier) => {
        const tierEnhancements = subcategoryEnhancements[tier.line];
        if (!tierEnhancements) return tier;

        return {
          ...tier,
          options: tier.options.map((option) => {
            const optionKey = getEmpiricOptionContentKey(option);
            const enhancement = tierEnhancements[optionKey];
            if (!enhancement) return option;
            const { plan: enhancementPlan, ...restEnhancement } = enhancement;
            const mergedPlan = option.plan || enhancementPlan
              ? {
                  ...(option.plan ?? {}),
                  ...(enhancementPlan ?? {}),
                }
              : undefined;
            const nextOption: EmpiricOption = {
              ...option,
              ...restEnhancement,
            };

            if (mergedPlan?.regimen) {
              nextOption.plan = mergedPlan as NonNullable<EmpiricOption["plan"]>;
            }

            return nextOption;
          }),
        };
      });

      return subcategory.empiricTherapy
        ? { ...subcategory, empiricTherapy: updatedTiers }
        : { ...subcategory, empiricRegimens: updatedTiers };
    }),
  };
}
