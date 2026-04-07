import ExpandCollapseBar from "../components/ExpandCollapseBar";
import Section from "../components/Section";
import SourceEvidencePills from "../components/SourceEvidencePills";
import type { CatalogDerived } from "../data/derived";
import { NAV_STATES } from "../styles/constants";
import type { NavigateTo, PathogenReference, Styles } from "../types";
import { buildPathogenBreakpointPreset } from "../utils/breakpointWorkspacePreset";

interface PathogenReferencePageProps {
  catalogDerived: CatalogDerived | null;
  expandedSections: Record<string, boolean>;
  navigateTo: NavigateTo;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  pathogen: PathogenReference;
  readingMode: boolean;
  S: Styles;
  toggleSection: (id: string) => void;
}

function Card({ title, body, note, sourceIds, S }: { title: string; body: string; note?: string; sourceIds?: string[]; S: Styles }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: S.card.background,
        borderRadius: "14px",
        border: `1px solid ${S.card.borderColor}`,
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{title}</div>
      <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.6 }}>{body}</div>
      {note ? <div style={{ fontSize: "12px", color: S.meta.textMuted, marginTop: "6px", lineHeight: 1.55 }}>{note}</div> : null}
      <SourceEvidencePills sourceIds={sourceIds} S={S} />
    </div>
  );
}

export default function PathogenReferencePage({
  catalogDerived,
  expandedSections,
  navigateTo,
  onCollapseAll,
  onExpandAll,
  pathogen,
  readingMode,
  S,
  toggleSection,
}: PathogenReferencePageProps) {
  const linkedDecisionSupport = (pathogen.relatedPathways ?? []).flatMap((pathway) => {
    const subcategory = pathway.subcategoryId
      ? catalogDerived?.subcategoryByDiseaseId[pathway.diseaseId]?.[pathway.subcategoryId] ?? null
      : null;

    if (!subcategory?.definitiveTherapy?.length) {
      return [];
    }

    return subcategory.definitiveTherapy
      .filter((entry) => !entry.match?.pathogenIds?.length || entry.match.pathogenIds.includes(pathogen.id))
      .map((entry) => ({
        pathway,
        subcategory,
        entry,
      }));
  });

  return (
    <>
      <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
        ← Home
      </button>

      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "22px 24px", marginBottom: "22px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Pathogen Reference</div>
          <h1 style={{ fontSize: "30px", lineHeight: 1.08, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>
            {pathogen.name}
          </h1>
          <div style={{ color: S.monographValue.color, fontSize: "14px", marginTop: "8px", lineHeight: 1.6 }}>{pathogen.phenotype}</div>
          <div style={{ ...S.proseCallout, marginTop: "14px" }}>
            <p style={{ ...S.monographValue, margin: 0 }}>{pathogen.summary}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
            {pathogen.likelySyndromes.map((syndrome) => (
              <span key={syndrome} style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                {syndrome}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
            <button
              type="button"
              style={{ ...S.expandAllBtn, marginRight: 0 }}
              onClick={() =>
                navigateTo(NAV_STATES.BREAKPOINTS, {
                  pathogenId: pathogen.id,
                  breakpointPreset: buildPathogenBreakpointPreset(pathogen),
                })
              }
            >
              Open breakpoint workspace
            </button>
          </div>
        </div>
      </section>

      <ExpandCollapseBar S={S} onExpand={onExpandAll} onCollapse={onCollapseAll} />

      <Section
        id="rapid-dx"
        title="Rapid Diagnostic Interpretation"
        icon="⚡"
        accentColor="#38bdf8"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
        defaultOpen
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {pathogen.rapidDiagnosticInterpretation.map((entry) => (
            <Card key={`${entry.title}-${entry.detail}`} title={entry.title} body={entry.detail} note={entry.note} sourceIds={entry.sourceIds} S={S} />
          ))}
        </div>
      </Section>

      <Section
        id="contamination"
        title="Contamination / Colonization Pitfalls"
        icon="🧪"
        accentColor="#f59e0b"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {pathogen.contaminationPitfalls.length > 0 ? (
            pathogen.contaminationPitfalls.map((entry) => (
              <Card
                key={`${entry.scenario}-${entry.action}`}
                title={entry.scenario}
                body={`${entry.implication} ${entry.action}`}
                sourceIds={entry.sourceIds}
                S={S}
              />
            ))
          ) : (
            <div style={S.proseCallout}>
              <p style={{ ...S.monographValue, margin: 0 }}>No major contamination or colonization traps are highlighted for this phenotype yet.</p>
            </div>
          )}
        </div>
      </Section>

      <Section
        id="mechanisms"
        title="Resistance Mechanisms"
        icon="🧬"
        accentColor="#a855f7"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {pathogen.resistanceMechanisms.map((entry) => (
            <Card key={`${entry.title}-${entry.detail}`} title={entry.title} body={entry.detail} note={entry.note} sourceIds={entry.sourceIds} S={S} />
          ))}
        </div>
      </Section>

      <Section
        id="breakpoints"
        title="Breakpoint Caveats"
        icon="📈"
        accentColor="#ef4444"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {pathogen.breakpointCaveats.map((entry) => (
            <Card key={`${entry.title}-${entry.detail}`} title={entry.title} body={entry.detail} note={entry.note} sourceIds={entry.sourceIds} S={S} />
          ))}
        </div>
      </Section>

      <Section
        id="therapy"
        title="Preferred Therapy By Site"
        icon="💊"
        accentColor="#34d399"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {pathogen.preferredTherapyBySite.map((entry) => {
            const breakpointPreset = buildPathogenBreakpointPreset(pathogen, { site: entry.site });
            return (
              <div
                key={`${entry.site}-${entry.preferred}`}
                style={{
                  padding: "14px 16px",
                  background: S.card.background,
                  borderRadius: "14px",
                  border: `1px solid ${S.card.borderColor}`,
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "8px" }}>
                  {entry.site}
                </div>
                <div style={{ fontSize: "13px", color: S.meta.textHeading, lineHeight: 1.6 }}>
                  <strong>Preferred:</strong> {entry.preferred}
                </div>
                {entry.alternatives?.length ? (
                  <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                    Alternatives: {entry.alternatives.join(" | ")}
                  </div>
                ) : null}
                {entry.avoid?.length ? (
                  <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px", lineHeight: 1.55 }}>
                    Avoid false reassurance from: {entry.avoid.join(" | ")}
                  </div>
                ) : null}
                <div style={{ fontSize: "12px", color: S.meta.textMuted, marginTop: "6px", lineHeight: 1.55 }}>{entry.rationale}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  <button
                    type="button"
                    style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                    onClick={() =>
                      navigateTo(NAV_STATES.BREAKPOINTS, {
                        pathogenId: pathogen.id,
                        breakpointPreset,
                      })
                    }
                  >
                    Review in workspace
                  </button>
                  {entry.linkedMonographIds?.map((monographId) => {
                    const found = catalogDerived?.findMonograph(monographId);
                    if (!found) return null;
                    return (
                      <button
                        key={`${entry.site}-${monographId}`}
                        type="button"
                        style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                        onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.disease.id, monographId })}
                      >
                        {found.monograph.name}
                      </button>
                    );
                  })}
                </div>
                <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
              </div>
            );
          })}
        </div>
      </Section>

      {linkedDecisionSupport.length > 0 ? (
        <Section
          id="pathway-decision-support"
          title="Linked Pathway Decision Support"
          icon="🎯"
          accentColor="#059669"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          readingMode={readingMode}
          S={S}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            {linkedDecisionSupport.map(({ pathway, entry }) => (
              <div
                key={`${pathway.diseaseId}-${pathway.subcategoryId}-${entry.id}`}
                style={{
                  padding: "14px 16px",
                  background: S.card.background,
                  borderRadius: "14px",
                  border: `1px solid ${S.card.borderColor}`,
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.title}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                  {pathway.label}
                </div>
                <div style={{ fontSize: "12px", color: S.meta.textHeading, marginTop: "8px", lineHeight: 1.6 }}>
                  <strong>Preferred:</strong> {entry.preferred.regimen}
                </div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                  {entry.preferred.why}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  <button
                    type="button"
                    style={{ ...S.crossRefPill, fontFamily: "inherit", marginRight: 0, marginBottom: 0 }}
                    onClick={() =>
                      pathway.subcategoryId
                        ? navigateTo(NAV_STATES.SUBCATEGORY, { diseaseId: pathway.diseaseId, subcategoryId: pathway.subcategoryId })
                        : navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: pathway.diseaseId })
                    }
                  >
                    Open pathway
                  </button>
                </div>
                <SourceEvidencePills sourceIds={entry.sourceIds} S={S} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        id="related"
        title="Related Pathways"
        icon="🧭"
        accentColor="#0284c7"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        readingMode={readingMode}
        S={S}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {(pathogen.relatedPathways ?? []).map((pathway) => {
            const disease = catalogDerived?.diseaseById[pathway.diseaseId] ?? null;
            const subcategory = pathway.subcategoryId
              ? catalogDerived?.subcategoryByDiseaseId[pathway.diseaseId]?.[pathway.subcategoryId] ?? null
              : null;
            return (
              <button
                key={`${pathway.diseaseId}-${pathway.subcategoryId ?? "overview"}`}
                type="button"
                className="pr-card result-card"
                style={{ ...S.card, marginBottom: 0, padding: "16px 18px", textAlign: "left" }}
                onClick={() =>
                  subcategory
                    ? navigateTo(NAV_STATES.SUBCATEGORY, { diseaseId: pathway.diseaseId, subcategoryId: subcategory.id })
                    : navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: pathway.diseaseId })
                }
              >
                <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{pathway.label}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px" }}>
                  {disease?.name ?? pathway.diseaseId}
                  {subcategory ? ` · ${subcategory.name}` : ""}
                </div>
              </button>
            );
          })}
        </div>
      </Section>
    </>
  );
}
