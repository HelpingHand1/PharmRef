import { useEffect, useMemo, useState } from "react";
import SourceEvidencePills from "../components/SourceEvidencePills";
import TransitionReadinessPanel from "../components/TransitionReadinessPanel";
import {
  formatNormalizedCombinationObservation,
  formatNormalizedSusceptibilityObservation,
  normalizeCombinationObservation,
  normalizeSusceptibilityObservation,
  SUSCEPTIBILITY_AGENT_OPTIONS,
  SUSCEPTIBILITY_COMBINATION_OPTIONS,
} from "../utils/normalizeSusceptibilityObservation";
import { buildSusceptibilityWorkspaceResult } from "../utils/susceptibilityWorkspace";
import { NAV_STATES } from "../styles/constants";
import type {
  BreakpointRapidDiagnostic,
  BreakpointWorkspacePreset,
  NavigateTo,
  NormalizedCombinationObservation,
  NormalizedSusceptibilityObservation,
  PathogenReference,
  PatientContext,
  Styles,
  SusceptibilityComparator,
  SusceptibilityCombinationTestMethod,
  SusceptibilityInterpretation,
} from "../types";

interface BreakpointWorkspacePageProps {
  crcl: number | null;
  findMonograph: (drugId: string) => { disease: { id: string }; monograph: { name: string; id: string } } | null;
  navigateTo: NavigateTo;
  patient: PatientContext;
  pathogens: PathogenReference[];
  selectedBreakpointPreset: BreakpointWorkspacePreset | null;
  selectedPathogenId: string | null;
  S: Styles;
}

const SITE_OPTIONS = [
  "bloodstream",
  "lung",
  "urine",
  "kidney",
  "systemic",
  "endovascular",
  "bladder",
];

const RAPID_DIAGNOSTIC_OPTIONS: BreakpointRapidDiagnostic[] = [
  "none",
  "mssa",
  "mrsa",
  "esbl",
  "kpc",
  "mbl",
  "dtr-pseudomonas",
  "candida",
];

const OUTCOME_COLORS = {
  avoid: "#dc2626",
  caution: "#d97706",
  reliable: "#059669",
} as const;

interface StructuredObservationDraft {
  key: number;
  agentId: string;
  interpretation: "" | SusceptibilityInterpretation;
  comparator: SusceptibilityComparator;
  value: string;
  units: "mg/L" | "mcg/mL";
}

interface StructuredCombinationDraft {
  key: number;
  comboId: string;
  interpretation: "" | SusceptibilityInterpretation;
  testMethod: SusceptibilityCombinationTestMethod;
}

const AGENT_LABEL_BY_ID = Object.fromEntries(
  SUSCEPTIBILITY_AGENT_OPTIONS.map((option) => [option.id, option.label]),
) as Record<string, string>;
const COMBINATION_LABEL_BY_ID = Object.fromEntries(
  SUSCEPTIBILITY_COMBINATION_OPTIONS.map((option) => [option.id, option.label]),
) as Record<string, string>;

let nextStructuredObservationKey = 1;
let nextStructuredCombinationKey = 1;

function resolvePresetSite(site: string | null | undefined) {
  return site && SITE_OPTIONS.includes(site) ? site : "bloodstream";
}

function resolvePresetInterpretation(
  value: SusceptibilityInterpretation | null | undefined,
) {
  return value ?? "susceptible";
}

function resolvePresetRapidDiagnostic(
  value: BreakpointRapidDiagnostic | null | undefined,
  fallback: BreakpointRapidDiagnostic,
) {
  return value && RAPID_DIAGNOSTIC_OPTIONS.includes(value) ? value : fallback;
}

function resolvePresetMic(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function createStructuredObservationDraft(): StructuredObservationDraft {
  return {
    key: nextStructuredObservationKey++,
    agentId: "",
    interpretation: "",
    comparator: "=",
    value: "",
    units: "mg/L",
  };
}

function createStructuredCombinationDraft(): StructuredCombinationDraft {
  return {
    key: nextStructuredCombinationKey++,
    comboId: "",
    interpretation: "",
    testMethod: "bde",
  };
}

function buildStructuredObservation(
  draft: StructuredObservationDraft,
): NormalizedSusceptibilityObservation | null {
  if (!draft.agentId) {
    return null;
  }

  const trimmedValue = draft.value.trim();
  const parsedValue = trimmedValue ? Number(trimmedValue) : undefined;
  if (trimmedValue && !Number.isFinite(parsedValue)) {
    return null;
  }

  if (!draft.interpretation && parsedValue === undefined) {
    return null;
  }

  const agentLabel = AGENT_LABEL_BY_ID[draft.agentId] ?? draft.agentId;
  const micSegment =
    parsedValue !== undefined
      ? `MIC ${draft.comparator === "=" ? "" : `${draft.comparator} `}${parsedValue} ${draft.units}`.trim()
      : "";

  return {
    raw: [agentLabel, draft.interpretation || "", micSegment].filter(Boolean).join(" "),
    normalizedAgentId: draft.agentId,
    agentLabel,
    interpretation: draft.interpretation || undefined,
    comparator: parsedValue !== undefined ? draft.comparator : undefined,
    value: parsedValue,
    units: parsedValue !== undefined ? draft.units : undefined,
  };
}

function buildStructuredCombinationObservation(
  draft: StructuredCombinationDraft,
): NormalizedCombinationObservation | null {
  if (!draft.comboId || !draft.interpretation) {
    return null;
  }

  const comboLabel = COMBINATION_LABEL_BY_ID[draft.comboId] ?? draft.comboId;
  const memberAgentIds =
    draft.comboId === "caz-avi-aztreonam"
      ? ["ceftazidime-avibactam", "aztreonam"]
      : [];

  return {
    raw: [comboLabel, draft.interpretation, draft.testMethod].join(" "),
    comboId: draft.comboId,
    comboLabel,
    memberAgentIds,
    interpretation: draft.interpretation,
    testMethod: draft.testMethod,
  };
}

export default function BreakpointWorkspacePage({
  crcl,
  findMonograph,
  navigateTo,
  patient,
  pathogens,
  selectedBreakpointPreset,
  selectedPathogenId,
  S,
}: BreakpointWorkspacePageProps) {
  const [pathogenId, setPathogenId] = useState<string>(selectedPathogenId ?? pathogens[0]?.id ?? "");
  const [site, setSite] = useState(() => resolvePresetSite(selectedBreakpointPreset?.site));
  const [interpretation, setInterpretation] = useState<SusceptibilityInterpretation>(() =>
    resolvePresetInterpretation(selectedBreakpointPreset?.interpretation),
  );
  const [rapidDiagnostic, setRapidDiagnostic] = useState<BreakpointRapidDiagnostic>(
    resolvePresetRapidDiagnostic(
      selectedBreakpointPreset?.rapidDiagnostic,
      patient.rapidDiagnosticResult ?? "none",
    ),
  );
  const [mic, setMic] = useState(() => resolvePresetMic(selectedBreakpointPreset?.mic));
  const [workspaceDialysis, setWorkspaceDialysis] = useState<PatientContext["dialysis"]>(patient.dialysis ?? "none");
  const [crclInput, setCrclInput] = useState(crcl !== null ? String(crcl) : "");
  const [structuredObservationDrafts, setStructuredObservationDrafts] = useState<StructuredObservationDraft[]>([]);
  const [structuredCombinationDrafts, setStructuredCombinationDrafts] = useState<StructuredCombinationDraft[]>([]);

  useEffect(() => {
    if (selectedPathogenId) {
      setPathogenId(selectedPathogenId);
    }
  }, [selectedPathogenId]);

  useEffect(() => {
    setSite(resolvePresetSite(selectedBreakpointPreset?.site));
    setInterpretation(resolvePresetInterpretation(selectedBreakpointPreset?.interpretation));
    setRapidDiagnostic(
      resolvePresetRapidDiagnostic(
        selectedBreakpointPreset?.rapidDiagnostic,
        patient.rapidDiagnosticResult ?? "none",
      ),
    );
    setMic(resolvePresetMic(selectedBreakpointPreset?.mic));
    setWorkspaceDialysis(patient.dialysis ?? "none");
    setCrclInput(crcl !== null ? String(crcl) : "");
    setStructuredObservationDrafts([]);
    setStructuredCombinationDrafts([]);
  }, [
    selectedBreakpointPreset?.interpretation,
    selectedBreakpointPreset?.mic,
    selectedBreakpointPreset?.rapidDiagnostic,
    selectedBreakpointPreset?.site,
    selectedPathogenId,
  ]);

  const workspaceCrcl = useMemo(() => {
    const trimmed = crclInput.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }, [crclInput]);

  const parsedObservation = useMemo(() => normalizeSusceptibilityObservation(mic), [mic]);
  const parsedCombinationObservation = useMemo(
    () => normalizeCombinationObservation(mic),
    [mic],
  );
  const structuredObservations = useMemo(
    () =>
      structuredObservationDrafts
        .map((draft) => buildStructuredObservation(draft))
        .filter((observation): observation is NormalizedSusceptibilityObservation => Boolean(observation)),
    [structuredObservationDrafts],
  );
  const structuredCombinationObservations = useMemo(
    () =>
      structuredCombinationDrafts
        .map((draft) => buildStructuredCombinationObservation(draft))
        .filter((observation): observation is NormalizedCombinationObservation => Boolean(observation)),
    [structuredCombinationDrafts],
  );
  const allObservations = useMemo(
    () => [...structuredObservations, ...(parsedObservation ? [parsedObservation] : [])],
    [parsedObservation, structuredObservations],
  );
  const allCombinationObservations = useMemo(
    () => [...structuredCombinationObservations, ...(parsedCombinationObservation ? [parsedCombinationObservation] : [])],
    [parsedCombinationObservation, structuredCombinationObservations],
  );

  const selectedPathogen = useMemo(
    () => pathogens.find((pathogen) => pathogen.id === pathogenId) ?? null,
    [pathogenId, pathogens],
  );

  const result = useMemo(() => {
    if (!selectedPathogen) return null;
    return buildSusceptibilityWorkspaceResult(selectedPathogen, {
      pathogenId: selectedPathogen.id,
      site,
      interpretation,
      rapidDiagnostic,
      mic,
      observations: allObservations,
      combinationObservations: allCombinationObservations,
      observation: parsedObservation,
      dialysis: workspaceDialysis ?? "none",
      crcl: workspaceCrcl,
      patient,
    });
  }, [allCombinationObservations, allObservations, interpretation, mic, parsedObservation, patient, rapidDiagnostic, selectedPathogen, site, workspaceCrcl, workspaceDialysis]);

  function resetExecutionContext() {
    setWorkspaceDialysis(patient.dialysis ?? "none");
    setCrclInput(crcl !== null ? String(crcl) : "");
  }

  function addStructuredObservation() {
    setStructuredObservationDrafts((drafts) =>
      drafts.length >= 4 ? drafts : [...drafts, createStructuredObservationDraft()],
    );
  }

  function updateStructuredObservation(
    key: number,
    patch: Partial<StructuredObservationDraft>,
  ) {
    setStructuredObservationDrafts((drafts) =>
      drafts.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft)),
    );
  }

  function removeStructuredObservation(key: number) {
    setStructuredObservationDrafts((drafts) => drafts.filter((draft) => draft.key !== key));
  }

  function addStructuredCombination() {
    setStructuredCombinationDrafts((drafts) =>
      drafts.length >= 2 ? drafts : [...drafts, createStructuredCombinationDraft()],
    );
  }

  function updateStructuredCombination(
    key: number,
    patch: Partial<StructuredCombinationDraft>,
  ) {
    setStructuredCombinationDrafts((drafts) =>
      drafts.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft)),
    );
  }

  function removeStructuredCombination(key: number) {
    setStructuredCombinationDrafts((drafts) => drafts.filter((draft) => draft.key !== key));
  }

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
      <div style={{ ...S.card, padding: "22px 24px", marginBottom: "22px" }}>
        <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Susceptibility Workspace</div>
        <h1 style={{ fontSize: "30px", lineHeight: 1.08, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>
          Breakpoint and phenotype sanity check
        </h1>
        <p style={{ ...S.monographValue, marginTop: "12px", marginBottom: 0 }}>
          Use organism phenotype, infection site, rapid diagnostic context, and interpretation status to catch false reassurance before a regimen gets locked in.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 340px) minmax(0, 1fr)", gap: "16px" }}>
        <section style={{ ...S.card, padding: "18px 20px", marginBottom: 0 }}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: S.meta.accent, marginBottom: "12px" }}>
            Input
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <label style={{ display: "grid", gap: "5px" }}>
              <span style={{ ...S.monographLabel, marginBottom: 0 }}>Pathogen phenotype</span>
              <select value={pathogenId} onChange={(event) => setPathogenId(event.target.value)} style={S.searchBox}>
                {pathogens.map((pathogen) => (
                  <option key={pathogen.id} value={pathogen.id}>
                    {pathogen.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: "5px" }}>
              <span style={{ ...S.monographLabel, marginBottom: 0 }}>Infection site</span>
              <select value={site} onChange={(event) => setSite(event.target.value)} style={S.searchBox}>
                {SITE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: "5px" }}>
              <span style={{ ...S.monographLabel, marginBottom: 0 }}>Interpretation</span>
              <select value={interpretation} onChange={(event) => setInterpretation(event.target.value as SusceptibilityInterpretation)} style={S.searchBox}>
                <option value="susceptible">Susceptible</option>
                <option value="sdd">Susceptible dose-dependent</option>
                <option value="intermediate">Intermediate</option>
                <option value="resistant">Resistant</option>
                <option value="unknown">Unknown / pending</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: "5px" }}>
              <span style={{ ...S.monographLabel, marginBottom: 0 }}>Rapid diagnostic</span>
              <select value={rapidDiagnostic} onChange={(event) => setRapidDiagnostic(event.target.value as BreakpointRapidDiagnostic)} style={S.searchBox}>
                {RAPID_DIAGNOSTIC_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: "5px" }}>
              <span style={{ ...S.monographLabel, marginBottom: 0 }}>MIC / note</span>
              <input value={mic} onChange={(event) => setMic(event.target.value)} style={S.searchBox} placeholder="e.g. MIC 2 or local note" />
            </label>
          </div>
          <div
            style={{
              marginTop: "14px",
              borderRadius: "14px",
              border: `1px solid ${S.meta.border}`,
              padding: "12px 14px",
              background: S.meta.bgSection,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
              <div>
                <div style={{ ...S.monographLabel, marginBottom: 0 }}>Structured MIC rows</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
                  Use explicit agent rows when more than one AST detail matters.
                </div>
              </div>
              <button type="button" style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }} onClick={addStructuredObservation}>
                Add agent MIC
              </button>
            </div>
            {structuredObservationDrafts.length ? (
              <div style={{ display: "grid", gap: "10px" }}>
                {structuredObservationDrafts.map((draft) => (
                  <div
                    key={draft.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "8px",
                      alignItems: "end",
                    }}
                  >
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Agent</span>
                      <select
                        value={draft.agentId}
                        onChange={(event) => updateStructuredObservation(draft.key, { agentId: event.target.value })}
                        style={S.searchBox}
                      >
                        <option value="">Select agent</option>
                        {SUSCEPTIBILITY_AGENT_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Reported call</span>
                      <select
                        value={draft.interpretation}
                        onChange={(event) =>
                          updateStructuredObservation(draft.key, {
                            interpretation: event.target.value as StructuredObservationDraft["interpretation"],
                          })
                        }
                        style={S.searchBox}
                      >
                        <option value="">Not entered</option>
                        <option value="susceptible">Susceptible</option>
                        <option value="sdd">SDD</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="resistant">Resistant</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </label>
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Compare</span>
                      <select
                        value={draft.comparator}
                        onChange={(event) =>
                          updateStructuredObservation(draft.key, {
                            comparator: event.target.value as SusceptibilityComparator,
                          })
                        }
                        style={S.searchBox}
                      >
                        <option value="=">=</option>
                        <option value="<">&lt;</option>
                        <option value="<=">&le;</option>
                        <option value=">">&gt;</option>
                        <option value=">=">&ge;</option>
                      </select>
                    </label>
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>MIC</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft.value}
                        onChange={(event) => updateStructuredObservation(draft.key, { value: event.target.value })}
                        style={S.searchBox}
                        placeholder="e.g. 2"
                      />
                    </label>
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Units</span>
                      <select
                        value={draft.units}
                        onChange={(event) =>
                          updateStructuredObservation(draft.key, {
                            units: event.target.value as StructuredObservationDraft["units"],
                          })
                        }
                        style={S.searchBox}
                      >
                        <option value="mg/L">mg/L</option>
                        <option value="mcg/mL">mcg/mL</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: "2px", justifySelf: "start" }}
                      onClick={() => removeStructuredObservation(draft.key)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>
                Add rows for cases like `caz-avi resistant` plus `meropenem MIC 1`, or to compare multiple antipseudomonal agents side by side.
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: "14px",
              borderRadius: "14px",
              border: `1px solid ${S.meta.border}`,
              padding: "12px 14px",
              background: S.meta.bgSection,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
              <div>
                <div style={{ ...S.monographLabel, marginBottom: 0 }}>Structured combo rows</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
                  Document paired-regimen support when combination testing or explicit co-administration matters.
                </div>
              </div>
              <button type="button" style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }} onClick={addStructuredCombination}>
                Add combo
              </button>
            </div>
            {structuredCombinationDrafts.length ? (
              <div style={{ display: "grid", gap: "10px" }}>
                {structuredCombinationDrafts.map((draft) => (
                  <div
                    key={draft.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: "8px",
                      alignItems: "end",
                    }}
                  >
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Combination</span>
                      <select
                        value={draft.comboId}
                        onChange={(event) => updateStructuredCombination(draft.key, { comboId: event.target.value })}
                        style={S.searchBox}
                      >
                        <option value="">Select combo</option>
                        {SUSCEPTIBILITY_COMBINATION_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Combo call</span>
                      <select
                        value={draft.interpretation}
                        onChange={(event) =>
                          updateStructuredCombination(draft.key, {
                            interpretation: event.target.value as StructuredCombinationDraft["interpretation"],
                          })
                        }
                        style={S.searchBox}
                      >
                        <option value="">Not entered</option>
                        <option value="susceptible">Susceptible</option>
                        <option value="sdd">SDD</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="resistant">Resistant</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </label>
                    <label style={{ display: "grid", gap: "5px" }}>
                      <span style={{ ...S.monographLabel, marginBottom: 0 }}>Support method</span>
                      <select
                        value={draft.testMethod}
                        onChange={(event) =>
                          updateStructuredCombination(draft.key, {
                            testMethod: event.target.value as SusceptibilityCombinationTestMethod,
                          })
                        }
                        style={S.searchBox}
                      >
                        <option value="bde">Broth disk elution</option>
                        <option value="local-combo">Local combo AST</option>
                        <option value="reported-pair">Reported paired plan</option>
                        <option value="not-stated">Method not stated</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: "2px", justifySelf: "start" }}
                      onClick={() => removeStructuredCombination(draft.key)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>
                Use this for paired strategies like `ceftazidime-avibactam + aztreonam` when combo AST, BDE support, or a documented paired-execution plan changes the interpretation.
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: "14px",
              borderRadius: "14px",
              border: `1px solid ${S.meta.border}`,
              padding: "12px 14px",
              background: S.meta.bgSection,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
              <div style={{ ...S.monographLabel, marginBottom: 0 }}>Execution context</div>
              <button type="button" style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }} onClick={resetExecutionContext}>
                Reset to patient
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label style={{ display: "grid", gap: "5px" }}>
                <span style={{ ...S.monographLabel, marginBottom: 0 }}>Dialysis / RRT</span>
                <select
                  value={workspaceDialysis ?? "none"}
                  onChange={(event) => setWorkspaceDialysis(event.target.value as PatientContext["dialysis"])}
                  style={S.searchBox}
                >
                  <option value="none">None</option>
                  <option value="HD">Hemodialysis (HD)</option>
                  <option value="PD">Peritoneal Dialysis (PD)</option>
                  <option value="CRRT">CRRT</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: "5px" }}>
                <span style={{ ...S.monographLabel, marginBottom: 0 }}>CrCl override</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={crclInput}
                  onChange={(event) => setCrclInput(event.target.value)}
                  style={S.searchBox}
                  placeholder="mL/min"
                />
              </label>
            </div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "10px", lineHeight: 1.6 }}>
              Starts from patient carryover: {patient.dialysis && patient.dialysis !== "none" ? patient.dialysis : "No dialysis flag"}
              {crcl !== null ? ` · CrCl ${crcl} mL/min` : " · CrCl not set"}
            </div>
          </div>
        </section>

        <section style={{ ...S.card, padding: "18px 20px", marginBottom: 0 }}>
          {result ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Assessment</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: S.meta.textHeading }}>{result.pathogen.name}</div>
                  <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>{result.pathogen.summary}</div>
                  {result.observations?.length ? (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: S.meta.textHeading,
                        }}
                      >
                        Parsed signals
                      </span>
                      {result.observations.map((observation) => (
                        <span
                          key={`${observation.raw}-${observation.normalizedAgentId ?? "raw"}`}
                          style={{
                            ...S.crossRefPill,
                            cursor: "default",
                            marginRight: 0,
                            marginBottom: 0,
                            color: S.monographValue.color,
                          }}
                        >
                          {formatNormalizedSusceptibilityObservation(observation)}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {result.combinationObservations?.length ? (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: S.meta.textHeading,
                        }}
                      >
                        Parsed combos
                      </span>
                      {result.combinationObservations.map((observation) => (
                        <span
                          key={`${observation.raw}-${observation.comboId}`}
                          style={{
                            ...S.crossRefPill,
                            cursor: "default",
                            marginRight: 0,
                            marginBottom: 0,
                            color: S.monographValue.color,
                          }}
                        >
                          {formatNormalizedCombinationObservation(observation)}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={() => navigateTo(NAV_STATES.PATHOGEN, { pathogenId: result.pathogen.id })}>
                  Open pathogen page
                </button>
              </div>

              {result.comboReadinessItems?.length ? (
                <div style={{ marginTop: "18px" }}>
                  <TransitionReadinessPanel
                    title="Combo Readiness"
                    subtitle="When the aztreonam pairing is under consideration, score whether support, renal execution, and the definitive handoff are actually locked."
                    items={result.comboReadinessItems}
                    S={S}
                  />
                </div>
              ) : null}

              {result.executionNotes?.length ? (
                <div style={{ marginTop: "18px" }}>
                  <div style={{ ...S.monographLabel, marginBottom: "8px" }}>Execution Focus</div>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {result.executionNotes.map((note) => (
                      <div key={`${note.title}-${note.detail}`} style={{ ...S.quickFactCard, padding: "14px 16px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{note.title}</div>
                        <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>
                          {note.detail}
                        </div>
                        {note.action ? (
                          <div style={{ fontSize: "12px", color: S.meta.textHeading, marginTop: "8px", lineHeight: 1.55 }}>
                            <strong>Action:</strong> {note.action}
                          </div>
                        ) : null}
                        {note.linkedMonographIds?.length ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                            {note.linkedMonographIds.map((monographId) => {
                              const found = findMonograph(monographId);
                              if (!found) return null;
                              return (
                                <button
                                  key={`${note.title}-${monographId}`}
                                  type="button"
                                  style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                                  onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.disease.id, monographId: found.monograph.id })}
                                >
                                  {found.monograph.name}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                        <SourceEvidencePills sourceIds={note.sourceIds} S={S} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
                {result.findings.map((finding) => (
                  <div
                    key={`${finding.outcome}-${finding.title}-${finding.detail}`}
                    style={{
                      border: `1px solid ${OUTCOME_COLORS[finding.outcome]}40`,
                      borderLeft: `4px solid ${OUTCOME_COLORS[finding.outcome]}`,
                      borderRadius: "12px",
                      background: `${OUTCOME_COLORS[finding.outcome]}12`,
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{finding.title}</div>
                      <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0, color: OUTCOME_COLORS[finding.outcome], borderColor: `${OUTCOME_COLORS[finding.outcome]}55` }}>
                        {finding.outcome}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>{finding.detail}</div>
                    {finding.linkedMonographIds?.length ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                        {finding.linkedMonographIds.map((monographId) => {
                          const found = findMonograph(monographId);
                          if (!found) return null;
                          return (
                            <button
                              key={`${finding.title}-${monographId}`}
                              type="button"
                              style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                              onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.disease.id, monographId: found.monograph.id })}
                            >
                              {found.monograph.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                    <SourceEvidencePills sourceIds={finding.sourceIds} S={S} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "18px" }}>
                <div style={{ ...S.monographLabel, marginBottom: "8px" }}>Matched therapy buckets</div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {result.matchedTherapy.map((therapy) => (
                    <div key={`${therapy.site}-${therapy.preferred}`} style={{ ...S.quickFactCard, padding: "14px 16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "8px" }}>
                        {therapy.site}
                      </div>
                      <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>
                        <strong>Preferred:</strong> {therapy.preferred}
                      </div>
                      {therapy.alternatives?.length ? (
                        <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                          Alternatives: {therapy.alternatives.join(" | ")}
                        </div>
                      ) : null}
                      {therapy.avoid?.length ? (
                        <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px", lineHeight: 1.55 }}>
                          False reassurance traps: {therapy.avoid.join(" | ")}
                        </div>
                      ) : null}
                      <SourceEvidencePills sourceIds={therapy.sourceIds} S={S} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: S.monographValue.color }}>Select a pathogen phenotype to start the breakpoint review.</div>
          )}
        </section>
      </div>
    </div>
  );
}
