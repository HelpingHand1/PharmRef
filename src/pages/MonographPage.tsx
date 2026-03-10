import { useCallback } from "react";
import AllergyWarning from "../components/AllergyWarning";
import ContentMetaCard from "../components/ContentMetaCard";
import CrossRefBadges from "../components/CrossRefBadges";
import ExpandCollapseBar from "../components/ExpandCollapseBar";
import Section from "../components/Section";
import { resolveContentMeta } from "../data/metadata";
import { aeCard, aeLabel, NAV_STATES } from "../styles/constants";
import type {
  AllergyRecord,
  DiseaseState,
  DrugMonograph,
  NavigateTo,
  PatientContext,
  Styles,
  ThemeKey,
} from "../types";

interface MonographPageProps {
  adjbw: number | null;
  allergies: AllergyRecord[];
  crcl: number | null;
  disease: DiseaseState;
  expandedSections: Record<string, boolean>;
  ibw: number | null;
  isBookmarked: (id: string) => boolean;
  monograph: DrugMonograph;
  monographXref: Record<string, DiseaseState[]>;
  navigateTo: NavigateTo;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  patient: PatientContext;
  readingMode: boolean;
  S: Styles;
  showToast: (message: string, icon?: string) => void;
  theme: ThemeKey;
  toggleBookmark: (id: string) => void;
  toggleSection: (id: string) => void;
}

export default function MonographPage({
  adjbw,
  allergies,
  crcl,
  disease,
  expandedSections,
  ibw,
  isBookmarked,
  monograph,
  monographXref,
  navigateTo,
  onCollapseAll,
  onExpandAll,
  patient,
  readingMode,
  S,
  showToast,
  theme,
  toggleBookmark,
  toggleSection,
}: MonographPageProps) {
  const { meta: pageMeta, inherited } = resolveContentMeta(monograph, disease);
  const isDark = theme !== "light";
  const crclColor = crcl === null ? "#8ea1bb" : crcl >= 60 ? "#34d399" : crcl >= 30 ? "#fbbf24" : "#f87171";
  const crclLabel = crcl === null ? "" : crcl >= 60 ? "Normal/Mild" : crcl >= 30 ? "Moderate impairment" : crcl >= 15 ? "Severe impairment" : "Kidney failure";
  const patientWeightActive = Boolean(patient.weight);
  const crclActive = crcl !== null;
  const bookmarkId = `monograph:${monograph.id}`;
  const bookmarked = isBookmarked(bookmarkId);
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
      <ContentMetaCard
        inheritedFrom={inherited ? disease.name : undefined}
        meta={pageMeta}
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
          { id: "renal", label: "Renal" },
          { id: "hepatic", label: "Hepatic" },
          { id: "ae", label: "Adverse Effects" },
          { id: "interactions", label: "Interactions" },
          { id: "monitoring", label: "Monitoring" },
          { id: "pregnancy", label: "Pregnancy" },
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

      <Section id="hepatic" title="Hepatic Dose Adjustment" icon="🫁" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.hepaticAdjustment}</p>
        </div>
      </Section>

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

      <Section id="pregnancy" title="Pregnancy & Lactation" icon="🤰" accentColor="#ec4899" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{monograph.pregnancyLactation}</p>
        </div>
      </Section>

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
