import { useState } from "react";
import type { ContentMeta, Styles } from "../types";
import {
  formatApprovedBodyVersion,
  formatReviewDate,
  getConfidenceBadge,
  getContentFreshness,
  getSourceLookupHref,
  resolveContentSources,
} from "../data/metadata";
import { getSourceIdentifiers } from "../data/source-registry";

interface ContentMetaCardProps {
  inheritedFrom?: string;
  meta: ContentMeta | null;
  S: Styles;
}

export default function ContentMetaCard({ inheritedFrom, meta, S }: ContentMetaCardProps) {
  const [copiedSource, setCopiedSource] = useState<string | null>(null);
  if (!meta) return null;

  const sources = resolveContentSources(meta);
  const latestReview = meta.reviewHistory[0] ?? null;
  const sourceCount = sources.length || meta.sources.length;
  const sourceLabel = `${sourceCount} source${sourceCount === 1 ? "" : "s"}`;
  const reviewHistoryLabel = `${meta.reviewHistory.length} review entr${meta.reviewHistory.length === 1 ? "y" : "ies"}`;
  const confidence = getConfidenceBadge(meta.confidence);
  const freshness = getContentFreshness(meta);
  const toneStyles =
    freshness.tone === "fresh"
      ? { background: "rgba(52,211,153,0.12)", borderColor: "rgba(52,211,153,0.28)", color: "#059669" }
      : freshness.tone === "info"
        ? { background: "rgba(56,189,248,0.12)", borderColor: "rgba(56,189,248,0.28)", color: "#0284c7" }
        : { background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.28)", color: "#d97706" };
  const confidenceStyles =
    confidence.tone === "fresh"
      ? { background: "rgba(52,211,153,0.12)", borderColor: "rgba(52,211,153,0.28)", color: "#059669" }
      : confidence.tone === "info"
        ? { background: "rgba(56,189,248,0.12)", borderColor: "rgba(56,189,248,0.28)", color: "#0284c7" }
        : { background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.28)", color: "#d97706" };

  const copyCitation = async (citation: string, key: string) => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedSource(key);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = citation;
      textarea.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!ok) {
        setCopiedSource(null);
        return;
      }
    }

    window.setTimeout(() => {
      setCopiedSource((current) => (current === key ? null : current));
    }, 1400);
  };

  return (
    <section
      style={{
        background: S.card.background,
        border: `1px solid ${S.card.borderColor}`,
        borderRadius: "16px",
        padding: "14px 16px",
        marginBottom: "18px",
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
        <span
          style={{
            ...S.crossRefPill,
            cursor: "default",
            marginRight: 0,
            marginBottom: 0,
            ...toneStyles,
          }}
        >
          {freshness.shortLabel}
        </span>
        <span
          style={{
            ...S.crossRefPill,
            cursor: "default",
            marginRight: 0,
            marginBottom: 0,
            ...confidenceStyles,
          }}
        >
          {confidence.shortLabel}
        </span>
        {meta.guidelineVersion && (
          <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
            {meta.guidelineVersion}
          </span>
        )}
        <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>{sourceLabel}</span>
      </div>

      {inheritedFrom && (
        <div style={{ fontSize: "12px", color: S.monographValue.color, marginBottom: "10px", lineHeight: 1.55 }}>
          This page is currently using inherited review metadata from {inheritedFrom}.
        </div>
      )}

      <div style={{ fontSize: "12px", color: S.monographValue.color, marginBottom: "10px", lineHeight: 1.55 }}>
        Reviewed on {formatReviewDate(meta.lastReviewed)} with {confidence.label.toLowerCase()} based on {sourceLabel}.
      </div>
      <div style={{ fontSize: "12px", color: S.monographValue.color, marginBottom: "10px", lineHeight: 1.55 }}>
        Reviewer: {meta.reviewedBy} · Owner: {meta.governance.owner} · Scope: {meta.reviewScope} · {reviewHistoryLabel}
      </div>
      <div style={{ fontSize: "12px", color: S.monographValue.color, marginBottom: "10px", lineHeight: 1.55 }}>
        Approved body version: {formatApprovedBodyVersion(meta.governance.approvedBodyVersion)}
      </div>
      {latestReview && (
        <div style={{ fontSize: "12px", color: S.meta.textHeading, marginBottom: "10px", lineHeight: 1.6 }}>
          Latest change: {latestReview.summary}
        </div>
      )}

      <details>
        <summary style={{ cursor: "pointer", color: S.meta.textHeading, fontSize: "13px", fontWeight: 700 }}>
          Evidence base and review history
        </summary>
        <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
          {sources.map((source) => (
            (() => {
              const lookup = getSourceLookupHref(source, `${source.label} ${source.citation}`);
              const key = `${source.id}-${source.citation}`;
              const identifiers = getSourceIdentifiers(source);
              return (
                <div
                  key={key}
                  style={{
                    border: `1px solid ${S.meta.border}`,
                    borderRadius: "12px",
                    padding: "10px 12px",
                    background: S.meta.accentSurface,
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 800, color: S.meta.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {source.kind}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading, marginTop: "4px" }}>{source.label}</div>
                  <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>{source.citation}</div>
                  {source.note && (
                    <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
                      {source.note}
                    </div>
                  )}
                  {identifiers.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                      {identifiers.map((identifier) => (
                        <span key={identifier} style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                          {identifier}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                    <button
                      type="button"
                      style={{ ...S.expandAllBtn, marginRight: 0 }}
                      onClick={() => copyCitation(`${source.label}. ${source.citation}`, key)}
                    >
                      {copiedSource === key ? "Copied citation" : "Copy citation"}
                    </button>
                    <a
                      href={lookup.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...S.expandAllBtn,
                        marginRight: 0,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {lookup.label}
                    </a>
                  </div>
                </div>
              );
            })()
          ))}
        </div>
        {meta.reviewHistory.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: S.meta.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
              Review history
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              {meta.reviewHistory.map((entry, index) => (
                <div
                  key={`${entry.reviewedOn}-${entry.reviewedBy}-${index}`}
                  style={{
                    border: `1px solid ${S.meta.border}`,
                    borderRadius: "12px",
                    padding: "10px 12px",
                    background: S.card.background,
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: S.meta.textHeading }}>
                    {formatReviewDate(entry.reviewedOn)} · {entry.reviewedBy}
                  </div>
                  <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
                    {entry.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </details>
    </section>
  );
}
