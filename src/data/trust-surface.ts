import type { ContentMeta } from "../types";
import { getConfidenceBadge, getContentFreshness } from "./metadata";

export interface TrustSurfaceHighlight {
  tone: "fresh" | "info" | "warn";
  title: string;
  detail: string;
}

export interface TrustSurfaceSummary {
  headline: string;
  highlights: TrustSurfaceHighlight[];
  freshnessLabel: string;
  freshnessTone: "fresh" | "info" | "warn";
  confidenceLabel: string;
  confidenceTone: "fresh" | "info" | "warn";
}

function normalizeHighlights(highlights: TrustSurfaceHighlight[]) {
  return highlights.filter((highlight) => highlight.detail.trim().length > 0);
}

export function buildTrustSurfaceSummary(meta?: ContentMeta | null): TrustSurfaceSummary | null {
  if (!meta) return null;

  const freshness = getContentFreshness(meta);
  const confidence = getConfidenceBadge(meta.confidence);
  const lowerConfidenceEntries = (meta.sectionConfidence ?? []).filter((entry) => entry.confidence !== "high");
  const highlights = normalizeHighlights([
    ...(freshness.tone !== "fresh"
      ? [
          {
            tone: freshness.tone,
            title: freshness.tone === "warn" ? "Stale content" : "Review aging",
            detail:
              freshness.tone === "warn"
                ? "Reconfirm newer guidance, labeling, and local policy before applying this page to edge-case decisions."
                : "This page is still in-date, but it is moving away from its latest formal review window.",
          } satisfies TrustSurfaceHighlight,
        ]
      : []),
    ...(meta.whatChanged ?? []).slice(0, 2).map((item) => ({
      tone: "info" as const,
      title: "Recent update",
      detail: item,
    })),
    ...(meta.guidelineDisagreements ?? []).slice(0, 2).map((entry) => ({
      tone: "warn" as const,
      title: entry.topic,
      detail: entry.pharmacistTakeaway,
    })),
    ...lowerConfidenceEntries.slice(0, 2).map((entry) => ({
      tone: (entry.confidence === "emerging" ? "warn" : "info") as "warn" | "info",
      title: `${entry.section} confidence`,
      detail: entry.rationale,
    })),
  ]);

  if (!highlights.length) return null;

  const headline =
    freshness.tone === "warn"
      ? "This page is past its freshness threshold."
      : meta.guidelineDisagreements?.length
        ? "This page includes active guidance disagreements."
        : meta.whatChanged?.length
          ? "This page has recent editorial changes."
          : lowerConfidenceEntries.length
            ? "This page contains moderate-confidence sections."
            : "This page has active editorial trust signals.";

  return {
    headline,
    highlights,
    freshnessLabel: freshness.shortLabel,
    freshnessTone: freshness.tone,
    confidenceLabel: confidence.shortLabel,
    confidenceTone: confidence.tone,
  };
}
