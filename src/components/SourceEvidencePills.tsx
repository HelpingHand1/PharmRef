import { getSourceLookupHref, resolveSourceEntry } from "../data/source-registry";
import type { Styles } from "../types";

interface SourceEvidencePillsProps {
  sourceIds?: string[];
  S: Styles;
}

export default function SourceEvidencePills({ sourceIds, S }: SourceEvidencePillsProps) {
  const sources = (sourceIds ?? []).map((sourceId) => resolveSourceEntry(sourceId)).filter(Boolean);

  if (!sources.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
      {sources.map((source) => {
        const lookup = getSourceLookupHref(source, source.label);
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
    </div>
  );
}
