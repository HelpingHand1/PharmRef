import type { CatalogDerived } from "../data/derived";
import type { DiseaseState, NavigateTo, Styles } from "../types";
import { getSourceLookupHref } from "../data/source-registry";
import { resolveOverviewEntrySources } from "../data/overview-evidence";
import { NAV_STATES } from "../styles/constants";
import Section from "../components/Section";
import ExpandCollapseBar from "../components/ExpandCollapseBar";
import ContentMetaCard from "../components/ContentMetaCard";

interface DiseaseOverviewPageProps {
  catalogDerived: CatalogDerived | null;
  disease: DiseaseState;
  expandedSections: Record<string, boolean>;
  navigateTo: NavigateTo;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  readingMode: boolean;
  S: Styles;
  theme: import("../types").ThemeKey;
  toggleSection: (id: string) => void;
}

export default function DiseaseOverviewPage({
  catalogDerived,
  disease,
  expandedSections,
  navigateTo,
  onCollapseAll,
  onExpandAll,
  readingMode,
  S,
  theme,
  toggleSection,
}: DiseaseOverviewPageProps) {
  const overview = disease.overview;
  const relatedPathogens = catalogDerived?.findPathogensForDisease(disease.id) ?? [];
  const summaryFacts = [
    { label: "Guidelines", value: `${overview.keyGuidelines.length} listed` },
    { label: "Landmark Trials", value: `${overview.landmarkTrials.length} listed` },
    { label: "Risk Factors", value: overview.riskFactors ? "Included" : "Not listed" },
    { label: "Subcategories", value: `${disease.subcategories.length} pathways` },
  ];

  return (
    <>
      <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
        ← All Disease States
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
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.82) 68%, rgba(14, 165, 233, 0.14) 100%)"
              : "linear-gradient(135deg, rgba(255, 253, 249, 0.98) 0%, rgba(248, 250, 247, 0.96) 68%, rgba(224, 242, 254, 0.62) 100%)",
        }}
      >
        <div className="page-hero-body" style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div
            className="page-hero-icon"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: S.meta.accentSurface,
              border: `1px solid ${S.meta.border}`,
              fontSize: "32px",
              flexShrink: 0,
            }}
          >
            {disease.icon}
          </div>
          <div className="page-hero-copy" style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Disease Overview</div>
            <h1 style={{ fontSize: "30px", lineHeight: 1.08, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>
              {disease.name}
            </h1>
            <div style={{ color: S.monographValue.color, fontSize: "14px", marginTop: "8px", lineHeight: 1.6 }}>{disease.category}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {disease.subcategories.length} subcategories
              </span>
              <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {disease.drugMonographs.length} monographs
              </span>
              {relatedPathogens.length > 0 && (
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                  {relatedPathogens.length} pathogen refs
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="quick-facts-grid" style={S.quickFactsGrid}>
          {summaryFacts.map((fact) => (
            <div key={fact.label} style={S.quickFactCard}>
              <div style={{ ...S.monographLabel, marginBottom: "6px" }}>{fact.label}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, lineHeight: 1.5 }}>{fact.value}</div>
            </div>
          ))}
        </div>
      </section>

      <ContentMetaCard meta={disease.contentMeta ?? null} S={S} />

      <ExpandCollapseBar S={S} onExpand={onExpandAll} onCollapse={onCollapseAll} />

      <Section
        id="overview"
        title="Overview & Epidemiology"
        icon="📖"
        accentColor="#38bdf8"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
        defaultOpen
      >
        <div style={S.proseCallout}>
          <p style={{ ...S.monographValue, margin: 0 }}>{overview.definition}</p>
        </div>
        {overview.epidemiology && (
          <div style={{ ...S.proseCallout, marginTop: "12px" }}>
            <div style={{ ...S.monographLabel, marginBottom: "8px" }}>Epidemiology</div>
            <p style={{ ...S.monographValue, margin: 0 }}>{overview.epidemiology}</p>
          </div>
        )}
        {overview.riskFactors && (
          <div style={{ ...S.proseCallout, marginTop: "12px" }}>
            <div style={{ ...S.monographLabel, marginBottom: "8px" }}>Risk Factors</div>
            <p style={{ ...S.monographValue, margin: 0 }}>{overview.riskFactors}</p>
          </div>
        )}
      </Section>

      <Section
        id="guidelines"
        title="Key Guidelines"
        icon="📋"
        accentColor="#34d399"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          {overview.keyGuidelines.map((guideline, index) => {
            const sources = resolveOverviewEntrySources(guideline);
            return (
              <div
                key={`${guideline.name}-${index}`}
                style={{ ...S.quickFactCard, padding: "16px 18px" }}
              >
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#34d399" }}>{guideline.name}</div>
                <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "8px", lineHeight: 1.65 }}>{guideline.detail}</div>
                {sources.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {sources.map((source) => {
                      const lookup = getSourceLookupHref(source, guideline.name);
                      return (
                        <a
                          key={source.id}
                          href={lookup.href}
                          target="_blank"
                          rel="noreferrer"
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
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        id="trials"
        title="Landmark Trials"
        icon="🧪"
        accentColor="#fbbf24"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          {overview.landmarkTrials.map((trial, index) => {
            const sources = resolveOverviewEntrySources(trial);
            return (
              <div
                key={`${trial.name}-${index}`}
                style={{ ...S.quickFactCard, padding: "16px 18px" }}
              >
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#fbbf24" }}>{trial.name}</div>
                <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "8px", lineHeight: 1.65 }}>{trial.detail}</div>
                {sources.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {sources.map((source) => {
                      const lookup = getSourceLookupHref(source, trial.name);
                      return (
                        <a
                          key={source.id}
                          href={lookup.href}
                          target="_blank"
                          rel="noreferrer"
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
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {relatedPathogens.length > 0 && (
        <Section
          id="pathogens"
          title="Related Pathogen References"
          icon="🧬"
          accentColor="#0284c7"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            {relatedPathogens.map((pathogen) => (
              <button
                key={pathogen.id}
                type="button"
                className="pr-card result-card"
                style={{ ...S.card, marginBottom: 0, padding: "16px 18px", textAlign: "left" }}
                onClick={() => navigateTo(NAV_STATES.PATHOGEN, { pathogenId: pathogen.id })}
              >
                <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{pathogen.name}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                  {pathogen.phenotype}
                </div>
                <div style={{ fontSize: "12px", color: S.meta.textMuted, marginTop: "8px", lineHeight: 1.55 }}>
                  {pathogen.summary}
                </div>
              </button>
            ))}
          </div>
        </Section>
      )}

      <div className="section-meta-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginTop: "30px", marginBottom: "12px", flexWrap: "wrap" }}>
        <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "13px" }}>Disease Subcategories</div>
        <div style={{ fontSize: "12px", color: S.monographValue.color }}>Open a syndrome-specific pathway to review empiric and targeted therapy.</div>
      </div>
      {disease.subcategories.map((subcategory) => (
        <div
          key={subcategory.id}
          className="pr-card disease-card"
          style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px" }}
          onClick={() => navigateTo(NAV_STATES.SUBCATEGORY, { disease, subcategory })}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{subcategory.name}</div>
            <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>
              {subcategory.definition}
            </div>
          </div>
          <span
            style={{
              color: S.meta.accent,
              fontSize: "20px",
              marginLeft: "12px",
              width: "34px",
              height: "34px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: S.meta.accentSurface,
              flexShrink: 0,
            }}
          >
            ›
          </span>
        </div>
      ))}

      <div className="section-meta-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginTop: "30px", marginBottom: "12px", flexWrap: "wrap" }}>
        <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "13px" }}>
          Drug Monographs ({disease.drugMonographs.length})
        </div>
        <div style={{ fontSize: "12px", color: S.monographValue.color }}>Direct access to detailed drug-level safety, dosing, and monitoring guidance.</div>
      </div>
      <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
        {disease.drugMonographs.map((drug) => (
          <div
            key={drug.id}
            className="pr-card result-card"
            style={{ ...S.card, marginBottom: 0, padding: "16px 18px" }}
            onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease, monograph: drug })}
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: S.meta.accent }}>{drug.name}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{drug.drugClass}</div>
          </div>
        ))}
      </div>
    </>
  );
}
