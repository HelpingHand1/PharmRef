import type { ContentMeta } from "../types";
import { DEFAULT_CONTENT_REVIEWER } from "./review-defaults";
import { APPROVED_CONTENT_VERSIONS } from "./content-approvals";

export function resolveContentOwner(meta: Pick<ContentMeta, "reviewedBy"> & { owner?: string }) {
  return meta.owner ?? meta.reviewedBy ?? DEFAULT_CONTENT_REVIEWER;
}

export function resolveApprovedBodyVersion(contentKey: string) {
  return APPROVED_CONTENT_VERSIONS[contentKey] ?? "";
}

export function formatApprovedBodyVersion(version: string, length = 8) {
  if (!version) return "unapproved";
  return version.slice(0, length);
}
