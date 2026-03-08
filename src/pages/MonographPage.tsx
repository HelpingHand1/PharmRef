import AllergyWarning from "../components/AllergyWarning";
import CrossRefBadges from "../components/CrossRefBadges";
import ExpandCollapseBar from "../components/ExpandCollapseBar";
import Section from "../components/Section";
import { aeCard, aeLabel, NAV_STATES } from "../styles/constants";
import type {
  AllergyRecord,
  DiseaseState,
  DrugMonograph,
  MonographLookupResult,
  NavStateKey,
  Styles,
  Subcategory,
} from "../types";

interface MonographPageProps {
  allergies: AllergyRecord[];
  disease: DiseaseState;
  expandedSections: Record<string, boolean>;
  monograph: DrugMonograph;
  monographXref: Record<string, DiseaseState[]>;
  navigateTo: (state: NavStateKey, data?: Partial<MonographLookupResult> & { subcategory?: Subcategory }) => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  readingMode: boolean;
  S: Styles;
  showToast: (message: string, icon?: string) => void;
  theme: "dark" | "light";
  toggleSection: (id: string) => void;
}

export default function MonographPage({
  allergies,
  disease,
  expandedSections,
  monograph,
  monographXref,
  navigateTo,
  onCollapseAll,
  onExpandAll,
  readingMode,
  S,
  showToast,
  theme,
  toggleSection,
}: MonographPageProps) {
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
          background:
            theme === "dark"
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.84) 62%, rgba(14, 165, 233, 0.16) 100%)"
              : "linear-gradient(135deg, rgba(255, 253, 249, 0.98) 0%, rgba(248, 250, 247, 0.96) 62%, rgba(224, 242, 254, 0.64) 100%)",
        }}
      >
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
      <ExpandCollapseBar S={S} onExpand={onExpandAll} onCollapse={onCollapseAll} />

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
              <div style={{ ...aeCard("#ef4444"), background: theme === "dark" ? "#7f1d1d20" : "#fee2e2", border: "2px solid #ef444480" }}>
                <div style={aeLabel("#ef4444")}>FDA Boxed Warnings</div>
                <p style={{ fontSize: "13px", color: theme === "dark" ? "#fca5a5" : "#991b1b", lineHeight: 1.6, margin: 0 }}>{monograph.adverseEffects.fdaBoxedWarnings}</p>
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
    </>
  );
}
