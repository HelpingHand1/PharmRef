import type { ContentConfidence, ContentMeta, DiseaseState } from "../types";
import type { ContentMetaSeed } from "./editorial/content-meta";
import {
  getMonographContentKey,
  getSubcategoryContentKey,
} from "./content-fingerprint";
import {
  DISEASE_CONTENT_META,
  MONOGRAPH_CONTENT_META,
  PRIORITY_MONOGRAPH_META_KEYS,
  PRIORITY_SUBCATEGORY_META_KEYS,
  SUBCATEGORY_CONTENT_META,
} from "./generated-content-meta";
import { resolveApprovedBodyVersion, resolveContentOwner } from "./content-governance";
import { DEFAULT_CONTENT_REVIEWER } from "./review-defaults";
import { resolveContentSource } from "./source-registry";
import { CONTENT_STALE_AFTER_DAYS } from "../version";

export { getSourceHref, getSourceLookupHref } from "./source-registry";
export { formatApprovedBodyVersion } from "./content-governance";
export {
  DISEASE_CONTENT_META,
  MONOGRAPH_CONTENT_META,
  PRIORITY_MONOGRAPH_META_KEYS,
  PRIORITY_SUBCATEGORY_META_KEYS,
  SUBCATEGORY_CONTENT_META,
} from "./generated-content-meta";

function ageInDays(lastReviewed: string): number | null {
  const parsed = new Date(`${lastReviewed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatReviewDate(value: string, format: "long" | "short" = "long") {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: format === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getContentFreshness(meta: ContentMeta) {
  const ageDays = ageInDays(meta.lastReviewed);
  if (ageDays === null) {
    return {
      tone: "warn" as const,
      label: "Review date unavailable",
      shortLabel: "Date unavailable",
      ageDays: null,
    };
  }

  if (ageDays > CONTENT_STALE_AFTER_DAYS) {
    return {
      tone: "warn" as const,
      label: `Review stale (${ageDays} days old)`,
      shortLabel: "Stale review",
      ageDays,
    };
  }

  if (ageDays > CONTENT_STALE_AFTER_DAYS / 2) {
    return {
      tone: "info" as const,
      label: `Review aging (${ageDays} days old)`,
      shortLabel: "Review aging",
      ageDays,
    };
  }

  return {
    tone: "fresh" as const,
    label: `Reviewed ${formatReviewDate(meta.lastReviewed)}`,
    shortLabel: `Reviewed ${formatReviewDate(meta.lastReviewed, "short")}`,
    ageDays,
  };
}

export function getConfidenceBadge(confidence: ContentConfidence) {
  switch (confidence) {
    case "high":
      return { label: "High confidence", shortLabel: "High confidence", tone: "fresh" as const };
    case "moderate":
      return { label: "Moderate confidence", shortLabel: "Moderate confidence", tone: "info" as const };
    default:
      return { label: "Emerging evidence", shortLabel: "Emerging evidence", tone: "warn" as const };
  }
}

export function getContentSearchBoost(meta: ContentMeta | null): number {
  if (!meta) return 0;

  const confidenceBoost = meta.confidence === "high" ? 6 : meta.confidence === "moderate" ? 3 : 0;
  const freshness = getContentFreshness(meta);
  const freshnessBoost = freshness.tone === "fresh" ? 3 : freshness.tone === "info" ? 1 : 0;
  return confidenceBoost + freshnessBoost;
}

export function resolveContentSources(meta: ContentMeta) {
  return meta.sources
    .map((source) => resolveContentSource(source))
    .filter((source): source is NonNullable<typeof source> => source !== null);
}

export function flattenContentMetaText(meta?: ContentMeta | null): string[] {
  if (!meta) return [];

  return [
    meta.guidelineVersion ?? "",
    ...meta.sources.flatMap((source) => [source.citation, source.note ?? ""]),
    ...meta.reviewHistory.flatMap((entry) => [entry.summary]),
    ...(meta.whatChanged ?? []),
    ...(meta.sectionConfidence?.flatMap((entry) => [entry.section, entry.confidence, entry.rationale]) ?? []),
    ...(meta.guidelineDisagreements?.flatMap((entry) => [
      entry.topic,
      entry.guidanceA,
      entry.guidanceB,
      entry.pharmacistTakeaway,
    ]) ?? []),
  ]
    .map((value) => value.trim())
    .filter(Boolean);
}

function finalizeContentMeta(
  seed: ContentMetaSeed | ContentMeta | undefined,
  reviewScope: string,
  contentKey: string,
): ContentMeta | undefined {
  if (!seed) return undefined;
  const reviewedBy = seed.reviewedBy ?? DEFAULT_CONTENT_REVIEWER;
  const { owner, governance, ...rest } = seed as ContentMetaSeed & Partial<ContentMeta>;
  const resolvedOwner = resolveContentOwner({ owner, reviewedBy });
  return {
    ...rest,
    reviewedBy,
    reviewScope: rest.reviewScope ?? reviewScope,
    reviewHistory: rest.reviewHistory ?? [],
    governance: {
      owner: governance?.owner ?? resolvedOwner,
      approvedBodyVersion: governance?.approvedBodyVersion ?? resolveApprovedBodyVersion(contentKey),
    },
  };
}

type ContentCarrier = { contentMeta?: ContentMeta | null };

function withResolvedApprovalVersion(meta: ContentMeta, contentKey?: string) {
  if (!contentKey) return meta;
  const approvedBodyVersion = resolveApprovedBodyVersion(contentKey) || meta.governance.approvedBodyVersion;
  if (approvedBodyVersion === meta.governance.approvedBodyVersion) return meta;

  return {
    ...meta,
    governance: {
      ...meta.governance,
      approvedBodyVersion,
    },
  };
}

export function resolveContentMeta(
  primary?: ContentCarrier | null,
  fallback?: ContentCarrier | null,
  options?: { contentKey?: string },
) {
  if (primary?.contentMeta) {
    return { meta: withResolvedApprovalVersion(primary.contentMeta, options?.contentKey), inherited: false };
  }

  if (fallback?.contentMeta) {
    return { meta: withResolvedApprovalVersion(fallback.contentMeta, options?.contentKey), inherited: true };
  }

  return { meta: null, inherited: false };
}

export function requiresExplicitSubcategoryMeta(diseaseId: string, subcategoryId: string) {
  return PRIORITY_SUBCATEGORY_META_KEYS.includes(`${diseaseId}/${subcategoryId}` as (typeof PRIORITY_SUBCATEGORY_META_KEYS)[number]);
}

export function requiresExplicitMonographMeta(monographId: string) {
  return PRIORITY_MONOGRAPH_META_KEYS.includes(monographId as (typeof PRIORITY_MONOGRAPH_META_KEYS)[number]);
}

export function attachDiseaseMetadata<T extends DiseaseState>(disease: T): T {
  const diseaseMeta = finalizeContentMeta(
    disease.contentMeta ?? DISEASE_CONTENT_META[disease.id],
    "Disease overview review",
    disease.id,
  );

  return {
    ...disease,
    contentMeta: diseaseMeta,
    subcategories: disease.subcategories.map((subcategory) => ({
      ...subcategory,
      contentMeta: finalizeContentMeta(
        subcategory.contentMeta ?? SUBCATEGORY_CONTENT_META[`${disease.id}/${subcategory.id}`],
        "Pathway review",
        getSubcategoryContentKey(disease.id, subcategory.id),
      ),
    })),
    drugMonographs: disease.drugMonographs.map((monograph) => ({
      ...monograph,
      contentMeta: finalizeContentMeta(
        monograph.contentMeta ?? MONOGRAPH_CONTENT_META[monograph.id],
        "Drug monograph review",
        getMonographContentKey(disease.id, monograph.id),
      ),
    })),
  };
}

export {
  computeDiseaseOverviewFingerprint,
  getMonographContentKey,
  getSubcategoryContentKey,
  computeMonographFingerprint,
  computeSubcategoryFingerprint,
} from "./content-fingerprint";
