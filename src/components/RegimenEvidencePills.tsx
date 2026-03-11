import { getSourceLookupHref, resolveEvidenceSourceText, resolveSourceEntry } from "../data/source-registry";
import type { Styles } from "../types";

interface RegimenEvidencePillsProps {
  evidence?: string;
  evidenceSource?: string;
  evidenceSourceIds?: string[];
  S: Styles;
}

export default function RegimenEvidencePills({
  evidence,
  evidenceSource,
  evidenceSourceIds,
  S,
}: RegimenEvidencePillsProps) {
  const sources =
    evidenceSourceIds && evidenceSourceIds.length > 0
      ? evidenceSourceIds.map((sourceId) => resolveSourceEntry(sourceId)).filter(Boolean)
      : resolveEvidenceSourceText(evidenceSource);

  if (!evidence && !evidenceSource && sources.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
      {evidence && (
        <span
          style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}
          title={evidenceSource ? `Evidence source: ${evidenceSource}` : `Evidence grade: ${evidence}`}
        >
          {evidence}
        </span>
      )}
      {sources.map((source) => {
        const lookup = getSourceLookupHref(source, evidenceSource);
        return (
          <a
            key={source.id}
            href={lookup.href}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            style={{
              ...S.crossRefPill,
              marginRight: 0,
              marginBottom: 0,
              textDecoration: "none",
            }}
          >
            {source.label}
          </a>
        );
      })}
      {evidenceSource && sources.length === 0 && (
        <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
          {evidenceSource}
        </span>
      )}
    </div>
  );
}
