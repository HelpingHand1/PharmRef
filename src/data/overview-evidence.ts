import type { EvidenceSource, OverviewEvidenceEntry } from "../types";
import { resolveEvidenceSourceText, resolveSourceEntry } from "./source-registry";

export function resolveOverviewEntrySources(entry: OverviewEvidenceEntry): EvidenceSource[] {
  if (entry.sourceIds && entry.sourceIds.length > 0) {
    return entry.sourceIds.map((sourceId) => resolveSourceEntry(sourceId)).filter(Boolean) as EvidenceSource[];
  }

  return resolveEvidenceSourceText(entry.name);
}
