import type {
  BreakpointNote,
  CoverageMatrixRow,
  DrugMonograph,
  IntrinsicResistanceAlert,
  RapidDiagnosticAction,
  Subcategory,
} from "../types";

type MicrobiologyCarrier = Pick<
  Subcategory,
  "rapidDiagnostics" | "breakpointNotes" | "intrinsicResistance" | "coverageMatrix"
> &
  Pick<
    DrugMonograph,
    "rapidDiagnostics" | "breakpointNotes" | "intrinsicResistance" | "coverageMatrix"
  >;

export const PRIORITY_MICROBIOLOGY_SUBCATEGORY_KEYS = new Set([
  "cap/cap-icu",
  "hap-vap/hap-mdr-risk",
  "uti/complicated-uti",
  "sepsis/septic-shock",
  "iai/ha-iai",
  "febrile-neutropenia/high-risk-fn",
  "bacteremia-endocarditis/sab-workup",
  "bacteremia-endocarditis/gram-negative-bacteremia",
  "amr-gn/cre-kpc",
  "amr-gn/cre-mbl",
  "amr-gn/dtr-pa",
  "amr-gn/crab-steno",
  "advanced-agents/cre-management",
  "advanced-agents/mdr-pseudomonas",
]);

export const PRIORITY_MICROBIOLOGY_MONOGRAPH_IDS = new Set([
  "aztreonam",
  "ceftazidime-avibactam",
  "meropenem-vaborbactam",
  "cefiderocol",
  "ceftolozane-tazobactam",
  "imipenem-cilastatin-relebactam",
]);

function trimList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function flattenRapidDiagnosticActions(actions?: RapidDiagnosticAction[] | null): string[] {
  if (!actions?.length) return [];
  return trimList(actions.flatMap((entry) => [entry.trigger, entry.action, entry.rationale ?? ""]));
}

export function flattenBreakpointNotes(notes?: BreakpointNote[] | null): string[] {
  if (!notes?.length) return [];
  return trimList(notes.flatMap((entry) => [entry.marker, entry.interpretation, entry.action ?? ""]));
}

export function flattenIntrinsicResistance(alerts?: IntrinsicResistanceAlert[] | null): string[] {
  if (!alerts?.length) return [];
  return trimList(alerts.flatMap((entry) => [entry.organism, entry.resistance, entry.implication]));
}

export function flattenCoverageMatrix(rows?: CoverageMatrixRow[] | null): string[] {
  if (!rows?.length) return [];
  return trimList(rows.flatMap((entry) => [entry.label, entry.status, entry.detail, entry.note ?? ""]));
}

export function flattenSubcategoryMicrobiologyText(subcategory: Subcategory): string[] {
  return trimList([
    ...flattenRapidDiagnosticActions(subcategory.rapidDiagnostics),
    ...flattenBreakpointNotes(subcategory.breakpointNotes),
    ...flattenIntrinsicResistance(subcategory.intrinsicResistance),
    ...flattenCoverageMatrix(subcategory.coverageMatrix),
  ]);
}

export function flattenMonographMicrobiologyText(monograph: DrugMonograph): string[] {
  return trimList([
    ...flattenRapidDiagnosticActions(monograph.rapidDiagnostics),
    ...flattenBreakpointNotes(monograph.breakpointNotes),
    ...flattenIntrinsicResistance(monograph.intrinsicResistance),
    ...flattenCoverageMatrix(monograph.coverageMatrix),
  ]);
}

export function hasMicrobiologyContent(item: MicrobiologyCarrier) {
  return Boolean(
    item.rapidDiagnostics?.length ||
      item.breakpointNotes?.length ||
      item.intrinsicResistance?.length ||
      item.coverageMatrix?.length,
  );
}
