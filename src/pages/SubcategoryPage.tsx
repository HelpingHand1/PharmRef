import { useCallback } from "react";
import ExpandCollapseBar from "../components/ExpandCollapseBar";
import ContentMetaCard from "../components/ContentMetaCard";
import EmpiricTierView from "../components/EmpiricTierView";
import Section from "../components/Section";
import { NAV_STATES } from "../styles/constants";
import { getSubcategoryContentKey, resolveContentMeta } from "../data/metadata";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";
import type {
  AllergyRecord,
  DiseaseState,
  MonographLookupResult,
  NavigateTo,
  PatientContext,
  Styles,
  Subcategory,
} from "../types";

interface SubcategoryPageProps {
  allergies: AllergyRecord[];
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
  const hasPatientContext = hasAnyPatientSignals(patient);
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
      label: "Empiric Tiers",
      value: subcategory.empiricTherapy?.length ? `${subcategory.empiricTherapy.length} tiers` : "No tiers listed",
    },
    {
      label: "Organism-Specific",
      value: hasOrganisms ? `${subcategory.organismSpecific?.length ?? 0} pathways` : "Not included",
    },
    {
      label: "Clinical Pearls",
      value: subcategory.pearls?.length ? `${subcategory.pearls.length} pearls` : "No pearls listed",
    },
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
            {subcategory.empiricTherapy && subcategory.empiricTherapy.length > 0 && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {subcategory.empiricTherapy.length} therapy tier{subcategory.empiricTherapy.length === 1 ? "" : "s"}
              </span>
            )}
            {hasOrganisms && (
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {(subcategory.organismSpecific?.length ?? 0)} organism pathways
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
            <>
              {crcl !== null && <span>CrCl {crcl} mL/min</span>}
              {patient.dialysis && patient.dialysis !== "none" && <span>{patient.dialysis}</span>}
              {patient.pregnant && <span>Pregnant</span>}
              {patient.weight && <span>{patient.weight} kg</span>}
            </>
          ) : (
            <span>Add age, sex, weight, and SCr to screen regimen-level renal and pregnancy cautions below.</span>
          )}
        </div>
        <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={() => navigateTo(NAV_STATES.CALCULATORS)}>
          Open calculators
        </button>
      </div>

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

      <Section
        id="empiric"
        title={
          subcategory.empiricTherapy?.some((tier) =>
            tier.line.toLowerCase().includes("prevention") || tier.line.toLowerCase().includes("stewardship"),
          )
            ? "Interventions & Protocols"
            : "Empiric Therapy"
        }
        icon="💊"
        accentColor="#34d399"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
        defaultOpen
      >
        {subcategory.empiricTherapy?.map((tier, index) => (
          <EmpiricTierView
            key={`${tier.line}-${index}`}
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
