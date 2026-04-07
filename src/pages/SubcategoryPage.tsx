import { useCallback } from "react";
import type { CatalogDerived } from "../data/derived";
import ExpandCollapseBar from "../components/ExpandCollapseBar";
import InstitutionAntibiogramCards from "../components/InstitutionAntibiogramCards";
import MicrobiologyCards from "../components/MicrobiologyCards";
import ContentMetaCard from "../components/ContentMetaCard";
import EmpiricTierView from "../components/EmpiricTierView";
import Section from "../components/Section";
import SourceEvidencePills from "../components/SourceEvidencePills";
import TransitionReadinessPanel from "../components/TransitionReadinessPanel";
import TrustSurfaceBanner from "../components/TrustSurfaceBanner";
import {
  INSTITUTION_PROFILE,
  getInstitutionPathwayAntibiogram,
  getInstitutionPathwayNotes,
} from "../data/institution-profile";
import { hasMicrobiologyContent } from "../data/microbiology";
import { NAV_STATES } from "../styles/constants";
import { getSubcategoryContentKey, resolveContentMeta } from "../data/metadata";
import {
  getPathwayWorkflowGroupTitles,
  getPreferredRegimenText,
  getSubcategoryWorkflowEntries,
} from "../data/stewardship";
import {
  getTreatmentSectionTitle,
  getTreatmentSummaryLabel,
  getTreatmentTiers,
  showsInfectiousDetail,
} from "../data/topic-surface";
import { buildPathogenBreakpointPreset } from "../utils/breakpointWorkspacePreset";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";
import { getPatientFitSortRank, getRegimenPatientFit } from "../utils/patientFit";
import {
  buildPatientContextTags,
  getPatientReassessmentFocus,
} from "../utils/patientStewardshipSummary";
import { getPathwayReassessmentItems } from "../utils/patientReassessmentEngine";
import { getPathwayTransitionReadiness } from "../utils/patientTransitionReadiness";
import {
  getDecisionSupportSiteHint,
  mapRapidDiagnosticToPathogenId,
  rankDecisionMatches,
} from "../utils/decisionSupport";
import type {
  AllergyRecord,
  EvidenceStatement,
  DiseaseState,
  DefinitiveTherapyRule,
  InteractionAction,
  MonographLookupResult,
  NavigateTo,
  OralStepDownOption,
  PatientContext,
  Styles,
  Subcategory,
} from "../types";

const DECISION_STATE_STYLES = {
  matched: { color: "#059669", border: "rgba(5,150,105,0.28)", background: "rgba(5,150,105,0.10)", label: "Matched" },
  needs_context: { color: "#d97706", border: "rgba(217,119,6,0.28)", background: "rgba(217,119,6,0.10)", label: "Needs context" },
  not_applicable: { color: "#64748b", border: "rgba(100,116,139,0.28)", background: "rgba(100,116,139,0.10)", label: "Not applicable" },
} as const;

const CONFIDENCE_STYLES = {
  high: { color: "#0284c7", border: "rgba(2,132,199,0.28)", background: "rgba(2,132,199,0.10)" },
  moderate: { color: "#7c3aed", border: "rgba(124,58,237,0.28)", background: "rgba(124,58,237,0.10)" },
  emerging: { color: "#b45309", border: "rgba(180,83,9,0.28)", background: "rgba(180,83,9,0.10)" },
} as const;

function renderWorkflowCards(
  entries: ReturnType<typeof getSubcategoryWorkflowEntries>,
  S: Styles,
) {
  return entries.map((entry) => (
    <div
      key={entry.key}
      style={{
        padding: "14px 16px",
        background: S.card.background,
        borderRadius: "16px",
        border: `1px solid ${S.card.borderColor}`,
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "18px" }}>{entry.icon}</span>
        <div style={{ fontWeight: 700, fontSize: "14px", color: entry.accentColor }}>{entry.label}</div>
        {entry.block?.status === "not_applicable" && (
          <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
            Not applicable
          </span>
        )}
      </div>
      {entry.block?.summary && (
        <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>{entry.block.summary}</div>
      )}
      {entry.block?.bullets?.length ? (
        <ul style={{ margin: "10px 0 0", paddingLeft: "18px", color: S.monographValue.color, lineHeight: 1.7 }}>
          {entry.block.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </div>
  ));
}

function summarizeLabels(values: string[], limit = 3) {
  const unique = [...new Set(values.filter(Boolean))];
  const shown = unique.slice(0, limit);
  const remaining = unique.length - shown.length;
  return [...shown, remaining > 0 ? `+${remaining} more` : ""].filter(Boolean).join(" | ");
}

function renderEvidenceCards(entries: EvidenceStatement[], S: Styles) {
  return entries.map((entry) => (
    <div
      key={`${entry.title}-${entry.detail}`}
      style={{
        padding: "14px 16px",
        background: S.card.background,
        borderRadius: "14px",
        border: `1px solid ${S.card.borderColor}`,
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.title}</div>
      <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>{entry.detail}</div>
      {entry.note ? <div style={{ fontSize: "12px", color: S.meta.textMuted, marginTop: "6px", lineHeight: 1.55 }}>{entry.note}</div> : null}
      <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
    </div>
  ));
}

const REASSESSMENT_STYLES = {
  critical: { border: "#ef4444", text: "#dc2626", bg: "rgba(239,68,68,0.10)", label: "Critical" },
  warn: { border: "#f59e0b", text: "#d97706", bg: "rgba(245,158,11,0.10)", label: "Caution" },
  info: { border: "#38bdf8", text: "#0284c7", bg: "rgba(56,189,248,0.10)", label: "Info" },
} as const;

function collectOptionInteractionActions(
  option: NonNullable<Subcategory["empiricTherapy"]>[number]["options"][number],
  findMonograph: (drugId: string) => MonographLookupResult | null,
) {
  const monographIds = [...new Set([option.monographId, ...(option.plan?.linkedMonographIds ?? [])].filter((value): value is string => Boolean(value)))];
  return monographIds.flatMap((monographId) => findMonograph(monographId)?.monograph.interactionActions ?? []) as InteractionAction[];
}

interface SubcategoryPageProps {
  allergies: AllergyRecord[];
  catalogDerived: CatalogDerived | null;
  copiedId: string | null;
  disease: DiseaseState;
  expandedSections: Record<string, boolean>;
  findMonograph: (drugId: string) => MonographLookupResult | null;
  navigateTo: NavigateTo;
  onCollapseAll: () => void;
  onCopy: (text: string, id: string) => void;
  onExpandAll: () => void;
  patient: PatientContext;
  readingMode: boolean;
  crcl: number | null;
  S: Styles;
  showToast: (message: string, icon?: string) => void;
  subcategory: Subcategory;
  toggleSection: (id: string) => void;
}

export default function SubcategoryPage({
  allergies,
  catalogDerived,
  copiedId,
  disease,
  expandedSections,
  findMonograph,
  navigateTo,
  onCollapseAll,
  onCopy,
  onExpandAll,
  patient,
  readingMode,
  crcl,
  S,
  showToast,
  subcategory,
  toggleSection,
}: SubcategoryPageProps) {
  const { meta: pageMeta, inherited } = resolveContentMeta(subcategory, disease, {
    contentKey: getSubcategoryContentKey(disease.id, subcategory.id),
  });
  const treatmentTiers = getTreatmentTiers(subcategory);
  const surfaceShowsInfectiousDetail = showsInfectiousDetail(disease);
  const workflowGroupTitles = getPathwayWorkflowGroupTitles(disease);
  const hasPatientContext = hasAnyPatientSignals(patient);
  const workflowEntries = getSubcategoryWorkflowEntries(subcategory, disease);
  const diagnosticWorkflow = workflowEntries.filter((entry) => entry.id === "workflow-diagnostics");
  const reassessmentWorkflow = workflowEntries.filter((entry) => entry.id === "workflow-reassessment");
  const transitionWorkflow = workflowEntries.filter((entry) => entry.id === "workflow-transition");
  const hasMicrobiology = surfaceShowsInfectiousDetail && hasMicrobiologyContent(subcategory);
  const relatedPathogens = surfaceShowsInfectiousDetail
    ? catalogDerived?.findPathogensForSubcategory(disease.id, subcategory.id) ?? []
    : [];
  const pathwayNotes = surfaceShowsInfectiousDetail
    ? getInstitutionPathwayNotes(disease.id, subcategory.id, INSTITUTION_PROFILE)
    : [];
  const pathwayAntibiogram = surfaceShowsInfectiousDetail
    ? getInstitutionPathwayAntibiogram(disease.id, subcategory.id, INSTITUTION_PROFILE)
    : [];
  const patientTags = buildPatientContextTags(patient, crcl);
  const patientReassessmentFocus = surfaceShowsInfectiousDetail ? getPatientReassessmentFocus(patient) : [];
  const pathwayTransitionReadiness = surfaceShowsInfectiousDetail ? getPathwayTransitionReadiness(patient) : [];
  const pathwayReassessmentItems = surfaceShowsInfectiousDetail ? getPathwayReassessmentItems(subcategory, patient) : [];
  const decisionSiteHint = getDecisionSupportSiteHint(disease.id, subcategory.id);
  const rapidDiagnosticPathogenId = mapRapidDiagnosticToPathogenId(patient.rapidDiagnosticResult);
  const decisionSupportContext = {
    allergies,
    crcl,
    patient,
    pathogenId: rapidDiagnosticPathogenId,
    rapidDiagnostic: patient.rapidDiagnosticResult ?? null,
    site: decisionSiteHint,
  };
  const definitiveMatchesRaw = rankDecisionMatches<DefinitiveTherapyRule>(
    subcategory.definitiveTherapy ?? [],
    decisionSupportContext,
  );
  const definitiveMatches = definitiveMatchesRaw.filter((match) => match.state !== "not_applicable").length
    ? definitiveMatchesRaw.filter((match) => match.state !== "not_applicable")
    : definitiveMatchesRaw;
  const oralStepDownMatchesRaw = rankDecisionMatches<OralStepDownOption>(
    subcategory.oralStepDown ?? [],
    decisionSupportContext,
  );
  const oralStepDownMatches = oralStepDownMatchesRaw.filter((match) => match.state !== "not_applicable").length
    ? oralStepDownMatchesRaw.filter((match) => match.state !== "not_applicable")
    : oralStepDownMatchesRaw;
  const patientFitOptions = surfaceShowsInfectiousDetail
    ? treatmentTiers
        .flatMap((tier) =>
          tier.options.map((option) => {
            const regimenText = getPreferredRegimenText(option.regimen, option.plan);
            const reference = option.monographId ?? option.drug;
            const interactionActions = collectOptionInteractionActions(option, findMonograph);
            const fit = getRegimenPatientFit(regimenText, reference, patient, crcl, option.plan, interactionActions);
            const found = option.monographId ? findMonograph(option.monographId) : null;
            return {
              fit,
              label: found?.monograph.name ?? regimenText,
              line: tier.line,
              regimenText,
            };
          }),
        )
        .sort((left, right) => getPatientFitSortRank(left.fit) - getPatientFitSortRank(right.fit))
    : [];
  const topPreferredFits = patientFitOptions.filter((entry) => entry.fit.status === "preferred").map((entry) => entry.label);
  const topCautionFits = patientFitOptions.filter((entry) => entry.fit.status === "caution").map((entry) => entry.label);
  const topNeedsDataFits = patientFitOptions.filter((entry) => entry.fit.status === "needs_data").map((entry) => entry.label);
  const topAvoidFits = patientFitOptions.filter((entry) => entry.fit.status === "avoid").map((entry) => entry.label);
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "🔗");
    } catch {
      showToast("Could not copy link", "⚠");
    }
  }, [showToast]);
  const hasOrganisms = (subcategory.organismSpecific?.length ?? 0) > 0;
  const summaryFacts = [
    {
      label: getTreatmentSummaryLabel(disease),
      value: treatmentTiers.length ? `${treatmentTiers.length} tiers` : "No tiers listed",
    },
    {
      label: "Clinical Pearls",
      value: subcategory.pearls?.length ? `${subcategory.pearls.length} pearls` : "No pearls listed",
    },
    {
      label: "Decision Support",
      value: subcategory.definitiveTherapy?.length
        ? `${subcategory.definitiveTherapy.length} definitive rule${subcategory.definitiveTherapy.length === 1 ? "" : "s"}`
        : "No structured rules",
    },
    ...(surfaceShowsInfectiousDetail
      ? [
          {
            label: "Organism-Specific",
            value: hasOrganisms ? `${subcategory.organismSpecific?.length ?? 0} pathways` : "Not included",
          },
          {
            label: "Microbiology",
            value: hasMicrobiology ? "Intelligence added" : "No dedicated cards",
          },
        ]
      : []),
  ];

  return (
    <>
      <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease })}>
        ← {disease.name}
      </button>

      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "22px 24px", marginBottom: "22px", position: "relative" }}>
        <button
          type="button"
          className="no-print"
          title="Copy link to this section"
          onClick={handleShare}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "transparent",
            border: `1px solid ${S.meta.border}`,
            borderRadius: "8px",
            color: S.meta.textMuted,
            fontSize: "16px",
            cursor: "pointer",
            padding: "5px 9px",
            lineHeight: 1,
            transition: "background 0.15s, border-color 0.15s, color 0.15s",
          }}
        >
          🔗
        </button>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>{disease.name}</div>
          <h1 style={{ fontSize: "28px", lineHeight: 1.08, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>{subcategory.name}</h1>
          <div style={{ color: S.monographValue.color, fontSize: "14px", lineHeight: 1.7, marginTop: "12px" }}>{subcategory.definition}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
            {treatmentTiers.length > 0 && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {treatmentTiers.length} therapy tier{treatmentTiers.length === 1 ? "" : "s"}
              </span>
            )}
            {surfaceShowsInfectiousDetail && hasOrganisms && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {(subcategory.organismSpecific?.length ?? 0)} organism pathways
              </span>
            )}
            {surfaceShowsInfectiousDetail && hasMicrobiology && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                Microbiology intelligence
              </span>
            )}
            {(subcategory.definitiveTherapy?.length ?? 0) > 0 && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                Definitive therapy engine
              </span>
            )}
            {(subcategory.oralStepDown?.length ?? 0) > 0 && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                Oral step-down engine
              </span>
            )}
            {surfaceShowsInfectiousDetail && relatedPathogens.length > 0 && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {relatedPathogens.length} phenotype refs
              </span>
            )}
          </div>
          <div className="quick-facts-grid" style={S.quickFactsGrid}>
            {summaryFacts.map((fact) => (
              <div key={fact.label} style={S.quickFactCard}>
                <div style={{ ...S.monographLabel, marginBottom: "6px" }}>{fact.label}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, lineHeight: 1.5 }}>{fact.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustSurfaceBanner
        meta={pageMeta}
        S={S}
      />

      <ContentMetaCard
        inheritedFrom={inherited ? disease.name : undefined}
        meta={pageMeta}
        S={S}
      />

      <div
        style={{
          ...S.patientBanner,
          background: hasPatientContext ? S.meta.accentSurface : S.card.background,
          border: `1px solid ${hasPatientContext ? `${S.meta.accent}35` : S.card.borderColor}`,
          color: hasPatientContext ? S.meta.textHeading : S.monographValue.color,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 800 }}>{hasPatientContext ? "👤 Patient context active" : "👤 Patient context not set"}</span>
          {hasPatientContext ? (
            patientTags.map((tag) => (
              <span
                key={tag}
                style={{
                  ...S.crossRefPill,
                  cursor: "default",
                  marginRight: 0,
                  marginBottom: 0,
                }}
              >
                {tag}
              </span>
            ))
          ) : (
            <span>
              {surfaceShowsInfectiousDetail
                ? "Add renal function, oral route, microbiology, and source-control flags to personalize fit, de-escalation, IV-to-PO, OPAT, and duration guidance below."
                : "Add age, renal function, pregnancy status, and active medications to personalize treatment selection and follow-up guidance below."}
            </span>
          )}
        </div>
        <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={() => navigateTo(NAV_STATES.CALCULATORS)}>
          Open calculators
        </button>
      </div>

      {surfaceShowsInfectiousDetail && hasPatientContext && patientFitOptions.length > 0 && (
        <div
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #34d399",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "18px",
            display: "grid",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#059669" }}>
            Patient Fit Snapshot
          </div>
          {topPreferredFits.length > 0 ? (
            <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>
              <strong style={{ color: "#059669" }}>Best fit now:</strong> {summarizeLabels(topPreferredFits)}
            </div>
          ) : null}
          {topCautionFits.length > 0 ? (
            <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>
              <strong style={{ color: "#d97706" }}>Use with caution:</strong> {summarizeLabels(topCautionFits)}
            </div>
          ) : null}
          {topNeedsDataFits.length > 0 ? (
            <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>
              <strong style={{ color: "#0284c7" }}>Needs more data:</strong> {summarizeLabels(topNeedsDataFits)}
            </div>
          ) : null}
          {topAvoidFits.length > 0 ? (
            <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>
              <strong style={{ color: "#dc2626" }}>Avoid for this patient:</strong> {summarizeLabels(topAvoidFits)}
            </div>
          ) : null}
        </div>
      )}

      {surfaceShowsInfectiousDetail && hasPatientContext && patientReassessmentFocus.length > 0 && (
        <div
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #f59e0b",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "18px",
            display: "grid",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706" }}>
            Patient Reassessment Focus
          </div>
          {patientReassessmentFocus.map((item) => {
            const palette = REASSESSMENT_STYLES[item.severity];
            return (
              <div
                key={`${item.title}-${item.detail}`}
                style={{
                  border: `1px solid ${palette.border}40`,
                  borderLeft: `4px solid ${palette.border}`,
                  borderRadius: "12px",
                  background: palette.bg,
                  padding: "10px 12px",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: palette.text }}>
                  {palette.label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading, marginTop: "4px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>{item.detail}</div>
              </div>
            );
          })}
        </div>
      )}

      {surfaceShowsInfectiousDetail && hasPatientContext && (
        <TransitionReadinessPanel
          items={pathwayTransitionReadiness}
          subtitle="This is a syndrome-level operational check using the current patient context. Pair it with the pathway's IV-to-PO and discharge workflow plus the chosen agent's monograph."
          title="Transition & Discharge Readiness"
          S={S}
        />
      )}

      {surfaceShowsInfectiousDetail && (hasPatientContext || (subcategory.reassessmentCheckpoints?.length ?? 0) > 0) && (
        <TransitionReadinessPanel
          items={pathwayReassessmentItems}
          subtitle="These checkpoints combine pathway-specific timeout content with the active patient culture and source-control state."
          title="Deterministic Reassessment Engine"
          S={S}
        />
      )}

      {surfaceShowsInfectiousDetail && pathwayNotes.length > 0 && INSTITUTION_PROFILE && (
        <div
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #0ea5e9",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "18px",
            display: "grid",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0284c7" }}>
            🏥 Local Stewardship Lens · {INSTITUTION_PROFILE.name}
          </div>
          {pathwayNotes.map((note) => (
            <div key={`${note.kind}-${note.title}`} style={{ display: "grid", gap: "4px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{note.title}</div>
              <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>{note.detail}</div>
            </div>
          ))}
        </div>
      )}

      {surfaceShowsInfectiousDetail && pathwayAntibiogram.length > 0 && INSTITUTION_PROFILE && (
        <div
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #059669",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "18px",
            display: "grid",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#059669" }}>
            📈 Local antibiogram overlay · {INSTITUTION_PROFILE.name}
          </div>
          <InstitutionAntibiogramCards entries={pathwayAntibiogram} S={S} />
        </div>
      )}

      {subcategory.durationGuidance && (
        <div
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #38bdf8",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "18px",
            display: "grid",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#38bdf8" }}>
            ⏱ Treatment Duration Guidance
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "14px" }}>
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: S.monographValue.color, marginBottom: "2px" }}>Standard</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, fontFamily: "'JetBrains Mono', monospace" }}>{subcategory.durationGuidance.standard}</div>
            </div>
            {subcategory.durationGuidance.severe && (
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#f87171", marginBottom: "2px" }}>Severe / Complicated</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f87171", fontFamily: "'JetBrains Mono', monospace" }}>{subcategory.durationGuidance.severe}</div>
              </div>
            )}
          </div>
          {subcategory.durationGuidance.opatNote && (
            <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600 }}>
              🏠 OPAT: {subcategory.durationGuidance.opatNote}
            </div>
          )}
          {subcategory.durationGuidance.stewardshipNote && (
            <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.5 }}>
              📋 {subcategory.durationGuidance.stewardshipNote}
            </div>
          )}
        </div>
      )}

      <ExpandCollapseBar S={S} onExpand={onExpandAll} onCollapse={onCollapseAll} />

      {subcategory.clinicalPresentation && !subcategory.clinicalPresentation.startsWith("N/A") && (
        <Section
          id="presentation"
          title="Clinical Presentation"
          icon="🩺"
          accentColor="#38bdf8"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={S.proseCallout}>
            <p style={{ ...S.monographValue, margin: 0 }}>{subcategory.clinicalPresentation}</p>
          </div>
        </Section>
      )}

      {subcategory.diagnostics && !subcategory.diagnostics.startsWith("N/A") && (
        <Section
          id="diagnostics"
          title="Diagnostics"
          icon="🔎"
          accentColor="#a78bfa"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={S.proseCallout}>
            <p style={{ ...S.monographValue, margin: 0 }}>{subcategory.diagnostics}</p>
          </div>
        </Section>
      )}

      {diagnosticWorkflow.length > 0 && (
        <Section
          id="workflow-diagnostics"
          title={workflowGroupTitles["workflow-diagnostics"]}
          icon="🧪"
          accentColor="#38bdf8"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>{renderWorkflowCards(diagnosticWorkflow, S)}</div>
        </Section>
      )}

      {(subcategory.diagnosticStewardship?.length ?? 0) > 0 && (
        <Section
          id="diagnostic-stewardship"
          title="Diagnostic Stewardship"
          icon="🧭"
          accentColor="#0284c7"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {renderEvidenceCards(subcategory.diagnosticStewardship ?? [], S)}
          </div>
        </Section>
      )}

      {reassessmentWorkflow.length > 0 && (
        <Section
          id="workflow-reassessment"
          title={workflowGroupTitles["workflow-reassessment"]}
          icon="🔄"
          accentColor="#f59e0b"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>{renderWorkflowCards(reassessmentWorkflow, S)}</div>
        </Section>
      )}

      {(subcategory.reassessmentCheckpoints?.length ?? 0) > 0 && (
        <Section
          id="reassessment-timeline"
          title="Structured Reassessment Timeline"
          icon="⏱"
          accentColor="#f59e0b"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {subcategory.reassessmentCheckpoints?.map((checkpoint) => (
              <div
                key={`${checkpoint.window}-${checkpoint.title}`}
                style={{
                  padding: "14px 16px",
                  background: S.card.background,
                  borderRadius: "16px",
                  border: `1px solid ${S.card.borderColor}`,
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                    {checkpoint.window}
                  </span>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{checkpoint.title}</div>
                </div>
                <div style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6 }}>{checkpoint.trigger}</div>
                {checkpoint.actions.length > 0 ? (
                  <ul style={{ margin: "10px 0 0", paddingLeft: "18px", color: S.monographValue.color, lineHeight: 1.7 }}>
                    {checkpoint.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                ) : null}
                <SourceEvidencePills sourceIds={checkpoint.sourceIds} S={S} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {transitionWorkflow.length > 0 && (
        <Section
          id="workflow-transition"
          title={workflowGroupTitles["workflow-transition"]}
          icon="💊"
          accentColor="#34d399"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>{renderWorkflowCards(transitionWorkflow, S)}</div>
        </Section>
      )}

      {(subcategory.contaminationPitfalls?.length ?? 0) > 0 && (
        <Section
          id="contamination-pitfalls"
          title="Contamination / Colonization Pitfalls"
          icon="🧪"
          accentColor="#ef4444"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {subcategory.contaminationPitfalls?.map((entry) => (
              <div
                key={`${entry.scenario}-${entry.action}`}
                style={{
                  padding: "14px 16px",
                  background: S.card.background,
                  borderRadius: "14px",
                  border: `1px solid ${S.card.borderColor}`,
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.scenario}</div>
                <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>{entry.implication}</div>
                <div style={{ fontSize: "12px", color: S.meta.textMuted, marginTop: "6px", lineHeight: 1.55 }}>{entry.action}</div>
                <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {(subcategory.durationAnchors?.length ?? 0) > 0 && (
        <Section
          id="duration-anchors"
          title="Duration Anchors"
          icon="📅"
          accentColor="#34d399"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {subcategory.durationAnchors?.map((entry) => (
              <div
                key={`${entry.event}-${entry.anchor}`}
                style={{
                  padding: "14px 16px",
                  background: S.card.background,
                  borderRadius: "14px",
                  border: `1px solid ${S.card.borderColor}`,
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "8px" }}>
                  {entry.event}
                </div>
                <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>{entry.anchor}</div>
                {entry.rationale ? <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{entry.rationale}</div> : null}
                <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {(subcategory.definitiveTherapy?.length ?? 0) > 0 && (
        <Section
          id="definitive-therapy"
          title="Definitive Therapy Engine"
          icon="🎯"
          accentColor="#059669"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
          defaultOpen
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {definitiveMatches.map((match) => {
              const entry = match.item;
              const stateStyle = DECISION_STATE_STYLES[match.state];
              const confidenceStyle = entry.confidence ? CONFIDENCE_STYLES[entry.confidence] : null;
              return (
                <div
                  key={entry.id}
                  style={{
                    padding: "16px",
                    background: S.card.background,
                    borderRadius: "16px",
                    border: `1px solid ${S.card.borderColor}`,
                    boxShadow: S.meta.shadowSm,
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{entry.title}</div>
                      <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                        {entry.organism} · {entry.susceptibility}
                        {entry.syndrome ? ` · ${entry.syndrome}` : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: stateStyle.color,
                          borderColor: stateStyle.border,
                          background: stateStyle.background,
                        }}
                      >
                        {stateStyle.label}
                      </span>
                      {confidenceStyle ? (
                        <span
                          style={{
                            ...S.crossRefPill,
                            cursor: "default",
                            marginRight: 0,
                            marginBottom: 0,
                            color: confidenceStyle.color,
                            borderColor: confidenceStyle.border,
                            background: confidenceStyle.background,
                          }}
                        >
                          {entry.confidence} confidence
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div style={{ border: "1px solid rgba(5,150,105,0.18)", background: "rgba(5,150,105,0.06)", borderRadius: "14px", padding: "12px 14px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "6px" }}>
                      Preferred
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.preferred.regimen}</div>
                    <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{entry.preferred.why}</div>
                    {entry.preferred.linkedMonographIds?.length ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {entry.preferred.linkedMonographIds.map((monographId) => {
                          const found = findMonograph(monographId);
                          if (!found) return null;
                          return (
                            <button
                              key={`${entry.id}-preferred-${monographId}`}
                              type="button"
                              style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                              onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.disease.id, monographId })}
                            >
                              {found.monograph.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                    <SourceEvidencePills sourceIds={entry.preferred.sourceIds} S={S} />
                  </div>

                  {[
                    { label: "Acceptable", color: "#0284c7", entries: entry.acceptable ?? [] },
                    { label: "Rescue", color: "#d97706", entries: entry.rescue ?? [] },
                    { label: "Avoid", color: "#dc2626", entries: entry.avoid ?? [] },
                  ].map((group) =>
                    group.entries.length ? (
                      <div key={`${entry.id}-${group.label}`} style={{ display: "grid", gap: "8px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: group.color }}>
                          {group.label}
                        </div>
                        {group.entries.map((branch, branchIndex) => (
                          <div key={`${entry.id}-${group.label}-${branchIndex}`} style={{ ...S.quickFactCard, padding: "12px 14px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{branch.regimen}</div>
                            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{branch.why}</div>
                            {branch.linkedMonographIds?.length ? (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                {branch.linkedMonographIds.map((monographId) => {
                                  const found = findMonograph(monographId);
                                  if (!found) return null;
                                  return (
                                    <button
                                      key={`${entry.id}-${group.label}-${monographId}`}
                                      type="button"
                                      style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                                      onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.disease.id, monographId })}
                                    >
                                      {found.monograph.name}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : null}
                            <SourceEvidencePills sourceIds={branch.sourceIds} S={S} />
                          </div>
                        ))}
                      </div>
                    ) : null,
                  )}

                  {match.matchedCriteria.length > 0 || match.blockedCriteria.length > 0 ? (
                    <div style={{ display: "grid", gap: "6px" }}>
                      {match.matchedCriteria.length > 0 ? (
                        <div style={{ fontSize: "12px", color: "#059669", lineHeight: 1.55 }}>
                          Matches: {match.matchedCriteria.join(" · ")}
                        </div>
                      ) : null}
                      {match.blockedCriteria.length > 0 ? (
                        <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>
                          Context gates: {match.blockedCriteria.join(" · ")}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {entry.monitoringFocus?.length ? (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0284c7", marginBottom: "6px" }}>
                        Monitoring focus
                      </div>
                      <ul style={{ margin: 0, paddingLeft: "18px", color: S.monographValue.color, lineHeight: 1.7 }}>
                        {entry.monitoringFocus.map((focus) => (
                          <li key={focus}>{focus}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {entry.disagreementNote ? (
                    <div style={{ fontSize: "12px", color: "#b45309", lineHeight: 1.55 }}>
                      Guideline disagreement: {entry.disagreementNote}
                    </div>
                  ) : null}
                  {entry.whatChanged?.length ? (
                    <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>
                      What changed: {entry.whatChanged.join(" · ")}
                    </div>
                  ) : null}
                  <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {(subcategory.oralStepDown?.length ?? 0) > 0 && (
        <Section
          id="oral-stepdown"
          title="Oral Step-Down Engine"
          icon="💊"
          accentColor="#0284c7"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {oralStepDownMatches.map((match) => {
              const entry = match.item;
              const stateStyle = DECISION_STATE_STYLES[match.state];
              const confidenceStyle = entry.confidence ? CONFIDENCE_STYLES[entry.confidence] : null;
              return (
                <div key={entry.id} style={{ ...S.quickFactCard, padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{entry.label}</div>
                      <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{entry.regimen}</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: stateStyle.color,
                          borderColor: stateStyle.border,
                          background: stateStyle.background,
                        }}
                      >
                        Rank {entry.rank}
                      </span>
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: stateStyle.color,
                          borderColor: stateStyle.border,
                          background: stateStyle.background,
                        }}
                      >
                        {stateStyle.label}
                      </span>
                      {confidenceStyle ? (
                        <span
                          style={{
                            ...S.crossRefPill,
                            cursor: "default",
                            marginRight: 0,
                            marginBottom: 0,
                            color: confidenceStyle.color,
                            borderColor: confidenceStyle.border,
                            background: confidenceStyle.background,
                          }}
                        >
                          {entry.confidence} confidence
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>
                      <strong>Bioavailability:</strong> {entry.bioavailability}
                    </div>
                    <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>
                      <strong>Penetration fit:</strong> {entry.penetration}
                    </div>
                    {entry.evidenceStrength ? (
                      <div style={{ fontSize: "12px", color: "#0284c7", lineHeight: 1.55 }}>
                        <strong>Evidence:</strong> {entry.evidenceStrength}
                      </div>
                    ) : null}
                    {entry.eligibilityChecklist.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: "18px", color: S.monographValue.color, lineHeight: 1.7 }}>
                        {entry.eligibilityChecklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                    {entry.barrierNotes?.length ? (
                      <div style={{ fontSize: "12px", color: "#b45309", lineHeight: 1.55 }}>
                        Barriers: {entry.barrierNotes.join(" · ")}
                      </div>
                    ) : null}
                    {match.matchedCriteria.length > 0 ? (
                      <div style={{ fontSize: "12px", color: "#059669", lineHeight: 1.55 }}>
                        Matches: {match.matchedCriteria.join(" · ")}
                      </div>
                    ) : null}
                    {match.blockedCriteria.length > 0 ? (
                      <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>
                        Context gates: {match.blockedCriteria.join(" · ")}
                      </div>
                    ) : null}
                    {entry.linkedMonographIds?.length ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {entry.linkedMonographIds.map((monographId) => {
                          const found = findMonograph(monographId);
                          if (!found) return null;
                          return (
                            <button
                              key={`${entry.id}-${monographId}`}
                              type="button"
                              style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                              onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.disease.id, monographId })}
                            >
                              {found.monograph.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                    {entry.disagreementNote ? (
                      <div style={{ fontSize: "12px", color: "#b45309", lineHeight: 1.55 }}>
                        Guideline disagreement: {entry.disagreementNote}
                      </div>
                    ) : null}
                    <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {(subcategory.durationRules?.length ?? 0) > 0 && (
        <Section
          id="duration-engine"
          title="Structured Duration Rules"
          icon="⏱"
          accentColor="#38bdf8"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {subcategory.durationRules?.map((entry) => {
              const confidenceStyle = entry.confidence ? CONFIDENCE_STYLES[entry.confidence] : null;
              return (
                <div key={entry.id} style={{ ...S.quickFactCard, padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{entry.label}</div>
                      <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                        Default duration: <strong style={{ color: "#38bdf8" }}>{entry.defaultDuration}</strong>
                      </div>
                    </div>
                    {confidenceStyle ? (
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: confidenceStyle.color,
                          borderColor: confidenceStyle.border,
                          background: confidenceStyle.background,
                        }}
                      >
                        {entry.confidence} confidence
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: "12px", color: S.meta.textHeading, lineHeight: 1.55 }}>
                    <strong>Anchor:</strong> {entry.anchorEvent}
                  </div>
                  {entry.appliesWhen?.length ? (
                    <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>
                      Applies when: {entry.appliesWhen.join(" · ")}
                    </div>
                  ) : null}
                  {entry.exceptions?.length ? (
                    <div style={{ fontSize: "12px", color: "#dc2626", lineHeight: 1.55 }}>
                      Exceptions: {entry.exceptions.join(" · ")}
                    </div>
                  ) : null}
                  <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {(subcategory.failureEscalationPath?.length ?? 0) > 0 && (
        <Section
          id="failure-path"
          title="Treatment Failure / Escalation Path"
          icon="📈"
          accentColor="#ef4444"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {subcategory.failureEscalationPath?.map((entry) => {
              const confidenceStyle = entry.confidence ? CONFIDENCE_STYLES[entry.confidence] : null;
              return (
                <div key={entry.id} style={{ ...S.quickFactCard, padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{entry.title}</div>
                      <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                        Checkpoint: {entry.checkpoint}
                      </div>
                    </div>
                    {confidenceStyle ? (
                      <span
                        style={{
                          ...S.crossRefPill,
                          cursor: "default",
                          marginRight: 0,
                          marginBottom: 0,
                          color: confidenceStyle.color,
                          borderColor: confidenceStyle.border,
                          background: confidenceStyle.background,
                        }}
                      >
                        {entry.confidence} confidence
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: "12px", color: S.meta.textHeading, lineHeight: 1.55 }}>
                    <strong>Trigger:</strong> {entry.trigger}
                  </div>
                  {entry.likelyCauses?.length ? (
                    <div style={{ fontSize: "12px", color: "#b45309", lineHeight: 1.55 }}>
                      Likely causes: {entry.likelyCauses.join(" · ")}
                    </div>
                  ) : null}
                  <ul style={{ margin: 0, paddingLeft: "18px", color: S.monographValue.color, lineHeight: 1.7 }}>
                    {entry.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                  <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {surfaceShowsInfectiousDetail && hasMicrobiology && (
        <Section
          id="microbiology"
          title="Microbiology Intelligence"
          icon="🧫"
          accentColor="#a855f7"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <MicrobiologyCards
            rapidDiagnostics={subcategory.rapidDiagnostics}
            breakpointNotes={subcategory.breakpointNotes}
            intrinsicResistance={subcategory.intrinsicResistance}
            coverageMatrix={subcategory.coverageMatrix}
            S={S}
          />
        </Section>
      )}

      {surfaceShowsInfectiousDetail && relatedPathogens.length > 0 && (
        <Section
          id="pathogen-links"
          title="Related Pathogen References"
          icon="🧬"
          accentColor="#0284c7"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {relatedPathogens.map((pathogen) => (
              <div
                key={pathogen.id}
                style={{
                  padding: "14px 16px",
                  background: S.card.background,
                  borderRadius: "16px",
                  border: `1px solid ${S.card.borderColor}`,
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{pathogen.name}</div>
                    <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                      {pathogen.phenotype}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    <button
                      type="button"
                      style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                      onClick={() => navigateTo(NAV_STATES.PATHOGEN, { pathogenId: pathogen.id })}
                    >
                      Open reference
                    </button>
                    <button
                      type="button"
                      style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                      onClick={() =>
                        navigateTo(NAV_STATES.BREAKPOINTS, {
                          pathogenId: pathogen.id,
                          breakpointPreset: buildPathogenBreakpointPreset(pathogen),
                        })
                      }
                    >
                      Breakpoint workspace
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: S.meta.textMuted, marginTop: "8px", lineHeight: 1.55 }}>{pathogen.summary}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section
        id="empiric"
        title={getTreatmentSectionTitle(subcategory, disease)}
        icon="💊"
        accentColor="#34d399"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
        defaultOpen
      >
        {treatmentTiers.map((tier, index) => (
          <EmpiricTierView
            key={`${tier.line}-${index}`}
            diseaseId={disease.id}
            subcategoryId={subcategory.id}
            surfaceMode={disease.surfaceMode}
            tier={tier}
            S={S}
            navigateTo={navigateTo}
            findMonograph={findMonograph}
            copiedId={copiedId}
            onCopy={onCopy}
            allergies={allergies}
            patient={patient}
            crcl={crcl}
          />
        ))}
      </Section>

      {hasOrganisms && (
        <Section
          id="organism"
          title="Organism-Specific Therapy"
          icon="🦠"
          accentColor="#f59e0b"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          {subcategory.organismSpecific?.map((organism, index) => (
            <div
              key={`${organism.organism}-${index}`}
              style={{
                padding: "16px",
                background: S.card.background,
                borderRadius: "16px",
                border: `1px solid ${S.card.borderColor}`,
                marginBottom: index < (subcategory.organismSpecific?.length ?? 0) - 1 ? "10px" : 0,
                boxShadow: S.meta.shadowSm,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#f59e0b", marginBottom: "10px" }}>{organism.organism}</div>
              <div style={S.detailList}>
                {organism.preferred && (
                  <div className="detail-row" style={S.detailRow}>
                    <div className="detail-key" style={S.detailKey}>Preferred</div>
                    <div className="detail-value" style={{ ...S.detailValue, color: "#34d399" }}>{organism.preferred}</div>
                  </div>
                )}
                {organism.alternative && (
                  <div className="detail-row" style={S.detailRow}>
                    <div className="detail-key" style={S.detailKey}>Alternative</div>
                    <div className="detail-value" style={{ ...S.detailValue, color: "#fbbf24" }}>{organism.alternative}</div>
                  </div>
                )}
                {organism.notes && (
                  <div className="detail-row" style={{ ...S.detailRow, borderBottom: "none", paddingBottom: 0 }}>
                    <div className="detail-key" style={S.detailKey}>Notes</div>
                    <div className="detail-value" style={S.detailValue}>{organism.notes}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Section>
      )}

      {subcategory.pearls && subcategory.pearls.length > 0 && (
        <Section
          id="pearls"
          title="Pharmacist Pearls & Clinical Tips"
          icon="💡"
          accentColor="#fbbf24"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          {subcategory.pearls.map((pearl, index) => (
            <div key={`${index}-${pearl.slice(0, 20)}`} style={S.pearlBox}>
              💡 {pearl}
            </div>
          ))}
        </Section>
      )}
    </>
  );
}
