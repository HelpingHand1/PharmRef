import { useCallback } from "react";
import type { CatalogDerived } from "../data/derived";
import AllergyWarning from "../components/AllergyWarning";
import ContentMetaCard from "../components/ContentMetaCard";
import CrossRefBadges from "../components/CrossRefBadges";
import ExpandCollapseBar from "../components/ExpandCollapseBar";
import InstitutionAntibiogramCards from "../components/InstitutionAntibiogramCards";
import MicrobiologyCards from "../components/MicrobiologyCards";
import MonographPatientGuidance from "../components/MonographPatientGuidance";
import RegimenCrossRefs from "../components/RegimenCrossRefs";
import Section from "../components/Section";
import SourceEvidencePills from "../components/SourceEvidencePills";
import TransitionReadinessPanel from "../components/TransitionReadinessPanel";
import TrustSurfaceBanner from "../components/TrustSurfaceBanner";
import {
  INSTITUTION_PROFILE,
  getInstitutionDrugAntibiogram,
  getInstitutionDrugPolicy,
} from "../data/institution-profile";
import { hasMicrobiologyContent } from "../data/microbiology";
import { getMonographContentKey, resolveContentMeta } from "../data/metadata";
import { aeCard, aeLabel, NAV_STATES } from "../styles/constants";
import { buildPathogenBreakpointPreset } from "../utils/breakpointWorkspacePreset";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";
import { getMonographTransitionReadiness } from "../utils/patientTransitionReadiness";
import type {
  AllergyRecord,
  DiseaseState,
  DrugMonograph,
  NavigateTo,
  PatientContext,
  RegimenReference,
  Styles,
  ThemeKey,
} from "../types";

interface MonographPageProps {
  adjbw: number | null;
  allergies: AllergyRecord[];
  catalogDerived: CatalogDerived | null;
  crcl: number | null;
  disease: DiseaseState;
  expandedSections: Record<string, boolean>;
  ibw: number | null;
  isBookmarked: (id: string) => boolean;
  monograph: DrugMonograph;
  monographXref: Record<string, DiseaseState[]>;
  regimenXref: Record<string, RegimenReference[]>;
  navigateTo: NavigateTo;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onOpenPatientModal: () => void;
  patient: PatientContext;
  readingMode: boolean;
  S: Styles;
  showToast: (message: string, icon?: string) => void;
  theme: ThemeKey;
  toggleBookmark: (id: string) => void;
  toggleSection: (id: string) => void;
}

function renderStructuredItems(
  items: Array<{ label: string; detail: string; note?: string }>,
  S: Styles,
) {
  return items.map((item) => (
    <div
      key={`${item.label}-${item.detail}`}
      style={{
        padding: "14px 16px",
        background: S.card.background,
        borderRadius: "14px",
        border: `1px solid ${S.card.borderColor}`,
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: S.meta.accent, marginBottom: "8px" }}>
        {item.label}
      </div>
      <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>{item.detail}</div>
      {item.note ? <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{item.note}</div> : null}
    </div>
  ));
}

function renderEvidenceStructuredItems(
  items: Array<{ label: string; detail: string; note?: string; sourceIds?: string[] }>,
  S: Styles,
) {
  return items.map((item) => (
    <div
      key={`${item.label}-${item.detail}`}
      style={{
        padding: "14px 16px",
        background: S.card.background,
        borderRadius: "14px",
        border: `1px solid ${S.card.borderColor}`,
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: S.meta.accent, marginBottom: "8px" }}>
        {item.label}
      </div>
      <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>{item.detail}</div>
      {item.note ? <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{item.note}</div> : null}
      <SourceEvidencePills sourceIds={item.sourceIds} S={S} />
    </div>
  ));
}

export default function MonographPage({
  adjbw,
  allergies,
  catalogDerived,
  crcl,
  disease,
  expandedSections,
  ibw,
  isBookmarked,
  monograph,
  monographXref,
  regimenXref,
  navigateTo,
  onCollapseAll,
  onExpandAll,
  onOpenPatientModal,
  patient,
  readingMode,
  S,
  showToast,
  theme,
  toggleBookmark,
  toggleSection,
}: MonographPageProps) {
  const { meta: pageMeta, inherited } = resolveContentMeta(monograph, disease, {
    contentKey: getMonographContentKey(disease.id, monograph.id),
  });
  const isDark = theme !== "light";
  const hasPatientContext = hasAnyPatientSignals(patient);
  const crclColor = crcl === null ? "#8ea1bb" : crcl >= 60 ? "#34d399" : crcl >= 30 ? "#fbbf24" : "#f87171";
  const crclLabel = crcl === null ? "" : crcl >= 60 ? "Normal/Mild" : crcl >= 30 ? "Moderate impairment" : crcl >= 15 ? "Severe impairment" : "Kidney failure";
  const patientWeightActive = Boolean(patient.weight);
  const crclActive = crcl !== null;
  const bookmarkId = `monograph:${monograph.id}`;
  const bookmarked = isBookmarked(bookmarkId);
  const institutionDrugPolicy = getInstitutionDrugPolicy(monograph.id, INSTITUTION_PROFILE);
  const institutionDrugAntibiogram = getInstitutionDrugAntibiogram(monograph.id, INSTITUTION_PROFILE);
  const hasMicrobiology = hasMicrobiologyContent(monograph);
  const relatedPathogens = catalogDerived?.findPathogensForMonograph(monograph.id) ?? [];
  const transitionReadiness = getMonographTransitionReadiness(monograph, patient);
  const penetrationEntries =
    monograph.penetration ??
    Object.entries(monograph.tissuePenetration ?? {})
      .filter(([, value]) => Boolean(value))
      .map(([site, detail]) => ({
        site,
        detail: detail ?? "",
      }));
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "🔗");
    } catch {
      showToast("Could not copy link", "⚠");
    }
  }, [showToast]);
  const quickFacts = [
    { label: "Drug Class", value: monograph.drugClass },
    { label: "Brand Names", value: monograph.brandNames || "Generic only" },
    {
      label: "Interactions",
      value: monograph.drugInteractions?.length ? `${monograph.drugInteractions.length} listed` : "None listed",
    },
    {
      label: "Safety Flag",
      value: monograph.adverseEffects?.fdaBoxedWarnings ? "FDA boxed warning" : "No boxed warning listed",
    },
  ];

  return (
    <>
      <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease })}>
        ← {disease.name}
      </button>
      <section
        className="page-hero"
        style={{
          ...S.card,
          cursor: "default",
          padding: "22px 24px",
          marginBottom: "22px",
          position: "relative",
          background:
            isDark
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.84) 62%, rgba(14, 165, 233, 0.16) 100%)"
              : "linear-gradient(135deg, rgba(255, 253, 249, 0.98) 0%, rgba(248, 250, 247, 0.96) 62%, rgba(224, 242, 254, 0.64) 100%)",
        }}
      >
        <button
          type="button"
          className="no-print"
          title="Copy link to this monograph"
          onClick={handleShare}
          style={{
            position: "absolute",
            top: "14px",
            right: "58px",
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
        <button
          type="button"
          className="no-print"
          title={bookmarked ? "Remove bookmark" : "Bookmark this monograph"}
          onClick={() => toggleBookmark(bookmarkId)}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: bookmarked
              ? isDark ? "rgba(251,191,36,0.15)" : "rgba(251,191,36,0.12)"
              : "transparent",
            border: `1px solid ${bookmarked ? "rgba(251,191,36,0.45)" : S.meta.border}`,
            borderRadius: "8px",
            color: bookmarked ? "#d97706" : S.meta.textSecondary,
            fontSize: "16px",
            cursor: "pointer",
            padding: "5px 9px",
            lineHeight: 1,
            transition: "background 0.15s, border-color 0.15s, color 0.15s",
          }}
        >
          🔖
        </button>
        <div className="page-hero-body" style={{ display: "flex", alignItems: "flex-start", gap: "18px", flexWrap: "wrap" }}>
          <div
            className="page-hero-icon"
            style={{
              width: "64px",
              height: "64px",
              background: S.meta.accentSurface,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              flexShrink: 0,
              border: `1px solid ${S.meta.border}`,
            }}
          >
            💊
          </div>
          <div className="page-hero-copy" style={{ minWidth: 0, flex: 1 }}>
            <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>{disease.name}</div>
            <h1 style={{ fontSize: "30px", lineHeight: 1.08, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>{monograph.name}</h1>
            <div style={{ fontSize: "14px", color: S.monographValue.color, marginTop: "8px", lineHeight: 1.6 }}>{monograph.brandNames}</div>
            <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span
                style={{
                  ...S.tag,
                  background: S.meta.accentSurface,
                  color: S.meta.accent,
                  border: `1px solid ${S.meta.accent}35`,
                }}
              >
                {monograph.drugClass}
              </span>
              {monograph.pkpdDriver && (
                <span
                  style={{
                    ...S.tag,
                    background: isDark ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.12)",
                    color: "#d97706",
                    border: "1px solid rgba(251,191,36,0.3)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                  }}
                  title="PK/PD driver — the pharmacokinetic parameter most predictive of efficacy"
                >
                  📊 {monograph.pkpdDriver.driver}
                </span>
              )}
              {monograph.ivToPoSwitch && (
                <span
                  style={{
                    ...S.tag,
                    background: isDark ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.1)",
                    color: "#059669",
                    border: "1px solid rgba(52,211,153,0.28)",
                    fontSize: "11px",
                  }}
                  title="IV to PO switch criteria available"
                >
                  💊→💊 IV→PO
                </span>
              )}
              {monograph.opatEligibility && (
                <span
                  style={{
                    ...S.tag,
                    background: isDark ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.1)",
                    color: "#0284c7",
                    border: "1px solid rgba(56,189,248,0.28)",
                    fontSize: "11px",
                  }}
                  title="OPAT eligibility information available"
                >
                  🏠 OPAT
                </span>
              )}
              {relatedPathogens.length > 0 && (
                <span
                  style={{
                    ...S.tag,
                    background: isDark ? "rgba(2,132,199,0.12)" : "rgba(2,132,199,0.10)",
                    color: "#0284c7",
                    border: "1px solid rgba(2,132,199,0.24)",
                    fontSize: "11px",
                  }}
                >
                  🧬 {relatedPathogens.length} phenotype ref{relatedPathogens.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            <div style={{ marginTop: "12px" }}>
              <CrossRefBadges
                drugId={monograph.id}
                currentDiseaseId={disease.id}
                monographXref={monographXref}
                navigateTo={navigateTo}
                showToast={showToast}
                currentDrugName={monograph.name}
                S={S}
              />
            </div>
            <AllergyWarning drugId={monograph.id} allergies={allergies} S={S} />
          </div>
        </div>
        <div className="quick-facts-grid" style={S.quickFactsGrid}>
          {quickFacts.map((fact) => (
            <div key={fact.label} style={S.quickFactCard}>
              <div style={{ ...S.monographLabel, marginBottom: "6px" }}>{fact.label}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, lineHeight: 1.5 }}>{fact.value}</div>
            </div>
          ))}
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
      <MonographPatientGuidance
        adjbw={adjbw}
        crcl={crcl}
        ibw={ibw}
        monograph={monograph}
        navigateTo={navigateTo}
        onOpenPatientModal={onOpenPatientModal}
        patient={patient}
        S={S}
      />
      {hasPatientContext && transitionReadiness.some((item) => item.status !== "not_applicable") && (
        <TransitionReadinessPanel
          items={transitionReadiness}
          subtitle="This uses the current patient context plus the structured IV-to-PO and OPAT blocks on this monograph."
          title="Transition Readiness"
          S={S}
        />
      )}
      {institutionDrugPolicy && INSTITUTION_PROFILE && (
        <section
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #0284c7",
            borderRadius: "16px",
            padding: "14px 16px",
            marginBottom: "18px",
            boxShadow: S.meta.shadowSm,
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0284c7", marginBottom: "8px" }}>
            🏥 Local formulary lens · {INSTITUTION_PROFILE.name}
          </div>
          {institutionDrugPolicy.restriction ? (
            <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>
              <strong>Restriction:</strong> {institutionDrugPolicy.restriction}
            </div>
          ) : null}
          {institutionDrugPolicy.approval ? (
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
              {institutionDrugPolicy.approval}
            </div>
          ) : null}
          {institutionDrugPolicy.preferredContexts?.length ? (
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "8px", lineHeight: 1.55 }}>
              Preferred local contexts: {institutionDrugPolicy.preferredContexts.join(" · ")}
            </div>
          ) : null}
          {institutionDrugPolicy.notes?.length ? (
            <div style={{ display: "grid", gap: "4px", marginTop: "8px" }}>
              {institutionDrugPolicy.notes.map((note) => (
                <div key={note} style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>
                  {note}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      )}
      {institutionDrugAntibiogram.length > 0 && INSTITUTION_PROFILE && (
        <section
          style={{
            background: S.card.background,
            border: `1px solid ${S.card.borderColor}`,
            borderLeft: "4px solid #059669",
            borderRadius: "16px",
            padding: "14px 16px",
            marginBottom: "18px",
            boxShadow: S.meta.shadowSm,
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "8px" }}>
            📈 Local antibiogram overlay · {INSTITUTION_PROFILE.name}
          </div>
          <InstitutionAntibiogramCards entries={institutionDrugAntibiogram} S={S} />
        </section>
      )}
      <RegimenCrossRefs
        currentDiseaseId={disease.id}
        currentDrugName={monograph.name}
        drugId={monograph.id}
        navigateTo={navigateTo}
        regimenXref={regimenXref}
        showToast={showToast}
        S={S}
      />
      <ExpandCollapseBar S={S} onExpand={onExpandAll} onCollapse={onCollapseAll} />

      <div
        className="no-print"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "16px",
        }}
      >
        {[
          { id: "moa", label: "Mechanism" },
          { id: "spectrum", label: "Spectrum" },
          { id: "dosing", label: "Dosing" },
          ...(monograph.dosingByIndication?.length ? [{ id: "dosing-by-indication", label: "Indication Dosing" }] : []),
          { id: "renal", label: "Renal" },
          ...(monograph.renalReplacement?.length ? [{ id: "rrt", label: "HD / CRRT" }] : []),
          { id: "hepatic", label: "Hepatic" },
          ...(monograph.specialPopulations?.length ? [{ id: "special-pop", label: "Special Pops" }] : []),
          { id: "ae", label: "Adverse Effects" },
          { id: "interactions", label: "Interactions" },
          { id: "monitoring", label: "Monitoring" },
          ...(monograph.monitoringActions?.length ? [{ id: "monitoring-actions", label: "Action Thresholds" }] : []),
          ...(monograph.therapeuticDrugMonitoring ? [{ id: "tdm", label: "TDM" }] : []),
          { id: "pregnancy", label: "Pregnancy" },
          ...(monograph.administration ? [{ id: "administration", label: "Administration" }] : []),
          ...(monograph.administrationConstraints?.length ? [{ id: "administration-constraints", label: "Admin Constraints" }] : []),
          ...(hasMicrobiology ? [{ id: "microbiology", label: "Microbiology" }] : []),
          ...(monograph.misuseTraps?.length ? [{ id: "misuse-traps", label: "Misuse Traps" }] : []),
          ...(penetrationEntries.length ? [{ id: "penetration", label: "Penetration" }] : []),
          ...(monograph.siteSpecificAvoidances?.length ? [{ id: "site-avoidances", label: "Site Avoidance" }] : []),
          ...(monograph.interactionActions?.length ? [{ id: "interaction-actions", label: "Actionable DDI" }] : []),
          ...(monograph.stewardshipUseCases?.length ? [{ id: "stewardship", label: "Stewardship" }] : []),
          { id: "pharm-pearls", label: "Pearls" },
          ...(monograph.ivToPoSwitch || monograph.opatEligibility ? [{ id: "opat-ipo", label: "IV→PO / OPAT" }] : []),
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            style={{
              background: S.meta.accentSurface,
              border: `1px solid ${S.meta.border}`,
              borderRadius: "9999px",
              color: S.meta.accent,
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 11px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onClick={() => {
              const el = document.getElementById(`section-${id}`);
              if (el) {
                toggleSection(id);
                setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <Section id="moa" title="Mechanism of Action" icon="⚙" accentColor="#38bdf8" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S} defaultOpen>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.mechanismOfAction}</p>
        </div>
      </Section>

      <Section id="spectrum" title="Spectrum of Activity" icon="🎯" accentColor="#34d399" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.spectrum}</p>
        </div>
      </Section>

      <Section id="dosing" title="Dosing" icon="📐" accentColor="#a78bfa" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={() => navigateTo(NAV_STATES.CALCULATORS)}>
            Open calculators
          </button>
          <span style={{ fontSize: "12px", color: S.monographValue.color }}>
            Use CrCl, IBW/AdjBW, vancomycin AUC, and aminoglycoside tools to individualize dosing.
          </span>
        </div>
        {patientWeightActive && (
          <div style={{ background: isDark ? "rgba(167,139,250,0.08)" : "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.28)", borderRadius: "10px", padding: "10px 14px", marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#a78bfa" }}>Patient Weights</span>
            {ibw !== null && <span style={{ fontSize: "12px", color: isDark ? "#e5eef8" : "#172033" }}>IBW <strong>{ibw} kg</strong></span>}
            {adjbw !== null && <span style={{ fontSize: "12px", color: isDark ? "#e5eef8" : "#172033" }}>AdjBW <strong>{adjbw} kg</strong></span>}
            <span style={{ fontSize: "12px", color: isDark ? "#e5eef8" : "#172033" }}>Actual <strong>{patient.weight} kg</strong></span>
          </div>
        )}
        {monograph.dosing ? (
          <div style={S.detailList}>
            {Object.entries(monograph.dosing).map(([key, value]) => (
              <div key={key} className="detail-row" style={S.detailRow}>
                <div className="detail-key" style={S.detailKey}>{key.replace(/_/g, " ")}</div>
                <div className="detail-value" style={{ ...S.detailValue, fontFamily: "'JetBrains Mono', monospace" }}>{value ?? "—"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={S.proseCallout}>
            <p style={{ ...S.monographValue, margin: 0 }}>No dosing details listed.</p>
          </div>
        )}
      </Section>

      {monograph.dosingByIndication?.length ? (
        <Section id="dosing-by-indication" title="Indication-Specific Dosing" icon="🎯" accentColor="#8b5cf6" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              monograph.dosingByIndication.map((entry) => ({
                label: entry.label,
                detail: entry.regimen,
                note: entry.notes,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      <Section id="renal" title="Renal Dose Adjustment" icon="🫘" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={() => navigateTo(NAV_STATES.CALCULATORS)}>
            Open calculators
          </button>
          {!crclActive && (
            <span style={{ fontSize: "12px", color: S.monographValue.color }}>
              Add patient age, sex, weight, and SCr to generate CrCl before finalizing renal dosing.
            </span>
          )}
        </div>
        {crclActive && (
          <div style={{ background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,253,249,0.9)", border: `1px solid ${crclColor}50`, borderLeft: `3px solid ${crclColor}`, borderRadius: "10px", padding: "10px 14px", marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#f59e0b" }}>Patient Renal Function</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: crclColor }}>CrCl {crcl} mL/min</span>
            <span style={{ fontSize: "12px", color: crclColor, fontWeight: 600 }}>{crclLabel}</span>
            {patient.dialysis && patient.dialysis !== "none" && (
              <span style={{ fontSize: "12px", background: isDark ? "rgba(239,68,68,0.15)" : "#fee2e2", color: "#ef4444", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px" }}>{patient.dialysis}</span>
            )}
          </div>
        )}
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.renalAdjustment}</p>
        </div>
      </Section>

      {monograph.renalReplacement?.length ? (
        <Section id="rrt" title="HD / PD / CRRT" icon="🩺" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              monograph.renalReplacement.map((entry) => ({
                label: entry.modality,
                detail: entry.guidance,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      <Section id="hepatic" title="Hepatic Dose Adjustment" icon="🫁" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.hepaticAdjustment}</p>
        </div>
      </Section>

      {monograph.specialPopulations?.length ? (
        <Section id="special-pop" title="Special Populations" icon="👥" accentColor="#38bdf8" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              monograph.specialPopulations.map((entry) => ({
                label: entry.population,
                detail: entry.guidance,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      <Section id="ae" title="Adverse Effects" icon="⚠" accentColor="#ef4444" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        {monograph.adverseEffects && (
          <div style={S.aeGrid}>
            <div style={aeCard("#fbbf24")}>
              <div style={aeLabel("#fbbf24")}>Common</div>
              <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{monograph.adverseEffects.common}</p>
            </div>
            <div style={aeCard("#ef4444")}>
              <div style={aeLabel("#ef4444")}>Serious</div>
              <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{monograph.adverseEffects.serious}</p>
            </div>
            {monograph.adverseEffects.rare && (
              <div style={aeCard("#64748b")}>
                <div style={aeLabel("#94a3b8")}>Rare</div>
                <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{monograph.adverseEffects.rare}</p>
              </div>
            )}
            {monograph.adverseEffects.fdaBoxedWarnings && (
              <div style={{ ...aeCard("#ef4444"), background: isDark ? "#7f1d1d20" : "#fee2e2", border: "2px solid #ef444480" }}>
                <div style={aeLabel("#ef4444")}>FDA Boxed Warnings</div>
                <p style={{ fontSize: "13px", color: isDark ? "#fca5a5" : "#991b1b", lineHeight: 1.6, margin: 0 }}>{monograph.adverseEffects.fdaBoxedWarnings}</p>
              </div>
            )}
            {monograph.adverseEffects.contraindications && (
              <div style={aeCard("#ef4444")}>
                <div style={aeLabel("#ef4444")}>Contraindications</div>
                <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{monograph.adverseEffects.contraindications}</p>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section id="interactions" title="Drug Interactions" icon="🔗" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        {monograph.drugInteractions && monograph.drugInteractions.length > 0 ? (
          monograph.drugInteractions.map((interaction, index) => (
            <div key={`${index}-${interaction.slice(0, 20)}`} style={S.interactionItem}>
              {interaction}
            </div>
          ))
        ) : (
          <div style={S.proseCallout}>
            <p style={{ ...S.monographValue, margin: 0 }}>No major interactions listed.</p>
          </div>
        )}
      </Section>

      <Section id="monitoring" title="Monitoring Parameters" icon="📊" accentColor="#38bdf8" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.monitoring}</p>
        </div>
      </Section>

      {monograph.monitoringActions?.length ? (
        <Section id="monitoring-actions" title="Monitoring Action Thresholds" icon="🚨" accentColor="#ef4444" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderEvidenceStructuredItems(
              monograph.monitoringActions.map((entry) => ({
                label: entry.trigger,
                detail: entry.action,
                note: entry.rationale,
                sourceIds: entry.sourceIds,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      {monograph.therapeuticDrugMonitoring ? (
        <Section id="tdm" title="Therapeutic Drug Monitoring" icon="📈" accentColor="#0284c7" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              [
                { label: "Target", detail: monograph.therapeuticDrugMonitoring.target },
                { label: "Sampling", detail: monograph.therapeuticDrugMonitoring.sampling },
                { label: "Adjustment", detail: monograph.therapeuticDrugMonitoring.adjustment },
                ...(monograph.therapeuticDrugMonitoring.pearls?.length
                  ? [{ label: "Pearls", detail: monograph.therapeuticDrugMonitoring.pearls.join(" · ") }]
                  : []),
              ],
              S,
            )}
          </div>
        </Section>
      ) : null}

      <Section id="pregnancy" title="Pregnancy & Lactation" icon="🤰" accentColor="#ec4899" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.pregnancyLactation}</p>
        </div>
      </Section>

      {monograph.administration ? (
        <Section id="administration" title="Administration" icon="💉" accentColor="#34d399" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              [
                ...(monograph.administration.infusion ? [{ label: "Infusion", detail: monograph.administration.infusion }] : []),
                ...(monograph.administration.compatibility ? [{ label: "Compatibility", detail: monograph.administration.compatibility }] : []),
                ...(monograph.administration.stability ? [{ label: "Stability", detail: monograph.administration.stability }] : []),
                ...(monograph.administration.oralAbsorption ? [{ label: "Oral absorption", detail: monograph.administration.oralAbsorption }] : []),
                ...(monograph.administration.note ? [{ label: "Operational note", detail: monograph.administration.note }] : []),
              ],
              S,
            )}
          </div>
        </Section>
      ) : null}

      {monograph.administrationConstraints?.length ? (
        <Section id="administration-constraints" title="Administration Constraints" icon="⏳" accentColor="#0284c7" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderEvidenceStructuredItems(
              monograph.administrationConstraints.map((entry) => ({
                label: entry.title,
                detail: entry.detail,
                note: entry.action,
                sourceIds: entry.sourceIds,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      {hasMicrobiology ? (
        <Section id="microbiology" title="Microbiology Intelligence" icon="🧫" accentColor="#a855f7" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <MicrobiologyCards
            rapidDiagnostics={monograph.rapidDiagnostics}
            breakpointNotes={monograph.breakpointNotes}
            intrinsicResistance={monograph.intrinsicResistance}
            coverageMatrix={monograph.coverageMatrix}
            S={S}
          />
        </Section>
      ) : null}

      {relatedPathogens.length ? (
        <Section id="pathogen-links" title="Related Pathogen References" icon="🧬" accentColor="#0284c7" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
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
      ) : null}

      {monograph.misuseTraps?.length ? (
        <Section id="misuse-traps" title="Misuse Traps" icon="🛑" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderEvidenceStructuredItems(
              monograph.misuseTraps.map((entry) => ({
                label: entry.scenario,
                detail: entry.risk,
                note: entry.saferApproach,
                sourceIds: entry.sourceIds,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      {penetrationEntries.length ? (
        <Section id="penetration" title="Tissue Penetration" icon="🧬" accentColor="#a78bfa" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              penetrationEntries.map((entry) => ({
                label: entry.site,
                detail: entry.detail,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      {monograph.siteSpecificAvoidances?.length ? (
        <Section id="site-avoidances" title="Site-Specific Avoidances" icon="📍" accentColor="#dc2626" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderEvidenceStructuredItems(
              monograph.siteSpecificAvoidances.map((entry) => ({
                label: entry.site,
                detail: entry.reason,
                note: entry.preferredApproach,
                sourceIds: entry.sourceIds,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      {monograph.interactionActions?.length ? (
        <Section id="interaction-actions" title="Actionable Interaction Management" icon="🔗" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              monograph.interactionActions.map((entry) => ({
                label: `${entry.interactingAgent}${entry.severity ? ` · ${entry.severity}` : ""}`,
                detail: `${entry.effect} ${entry.management}`,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      {monograph.stewardshipUseCases?.length ? (
        <Section id="stewardship" title="Stewardship Use Cases" icon="🧭" accentColor="#34d399" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <div style={{ display: "grid", gap: "10px" }}>
            {renderStructuredItems(
              monograph.stewardshipUseCases.map((entry) => ({
                label: entry.scenario,
                detail: entry.role,
                note: entry.notes,
              })),
              S,
            )}
          </div>
        </Section>
      ) : null}

      <Section id="pharm-pearls" title="Pharmacist Pearls" icon="💡" accentColor="#fbbf24" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        {monograph.pharmacistPearls?.map((pearl, index) => (
          <div key={`${index}-${pearl.slice(0, 20)}`} style={S.pearlBox}>
            💡 {pearl}
          </div>
        ))}
      </Section>

      {(monograph.ivToPoSwitch || monograph.opatEligibility) && (
        <Section id="opat-ipo" title="IV→PO Switch & OPAT Eligibility" icon="🏠" accentColor="#34d399" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S} defaultOpen>
          {monograph.ivToPoSwitch && (
            <div
              style={{
                background: isDark ? "rgba(52,211,153,0.07)" : "rgba(52,211,153,0.06)",
                border: "1px solid rgba(52,211,153,0.28)",
                borderRadius: "12px",
                padding: "14px 16px",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#059669", marginBottom: "8px" }}>
                💊 IV → PO Switch Criteria
              </div>
              {monograph.ivToPoSwitch.switchCriteria && (
                <p style={{ fontSize: "13px", color: isDark ? "#e5eef8" : "#172033", margin: "0 0 8px", lineHeight: 1.6 }}>{monograph.ivToPoSwitch.switchCriteria}</p>
              )}
              {monograph.ivToPoSwitch.poBioavailability && (
                <div style={{ fontSize: "12px", color: isDark ? "#8ea1bb" : "#66758c" }}>
                  Oral bioavailability: <strong style={{ color: "#059669" }}>{monograph.ivToPoSwitch.poBioavailability}</strong>
                </div>
              )}
              {monograph.ivToPoSwitch.note && (
                <p style={{ fontSize: "12px", color: isDark ? "#8ea1bb" : "#66758c", margin: "8px 0 0", lineHeight: 1.6 }}>{monograph.ivToPoSwitch.note}</p>
              )}
            </div>
          )}
          {monograph.opatEligibility && (
            <div
              style={{
                background: isDark ? "rgba(56,189,248,0.07)" : "rgba(56,189,248,0.06)",
                border: "1px solid rgba(56,189,248,0.28)",
                borderRadius: "12px",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0284c7", marginBottom: "8px" }}>
                🏠 OPAT Eligibility
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    background: monograph.opatEligibility.eligible === "yes" ? "#059669" : monograph.opatEligibility.eligible === "conditional" ? "#d97706" : "#dc2626",
                    color: "#fff",
                  }}
                >
                  {monograph.opatEligibility.eligible === "yes" ? "✓ OPAT Eligible" : monograph.opatEligibility.eligible === "conditional" ? "⚠ Conditional" : "✗ Not Recommended"}
                </span>
              </div>
              <div style={S.detailList}>
                {monograph.opatEligibility.administration && (
                  <div className="detail-row" style={S.detailRow}>
                    <div className="detail-key" style={S.detailKey}>Administration</div>
                    <div className="detail-value" style={S.detailValue}>{monograph.opatEligibility.administration}</div>
                  </div>
                )}
                {monograph.opatEligibility.monitoring && (
                  <div className="detail-row" style={{ ...S.detailRow, borderBottom: "none" }}>
                    <div className="detail-key" style={S.detailKey}>Monitoring</div>
                    <div className="detail-value" style={S.detailValue}>{monograph.opatEligibility.monitoring}</div>
                  </div>
                )}
              </div>
              {monograph.opatEligibility.considerations && monograph.opatEligibility.considerations.map((c, i) => (
                <div key={i} style={{ fontSize: "12px", color: isDark ? "#8ea1bb" : "#66758c", lineHeight: 1.6, marginBottom: "4px", marginTop: "6px" }}>• {c}</div>
              ))}
            </div>
          )}
        </Section>
      )}
    </>
  );
}
