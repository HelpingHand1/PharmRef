import { useMemo, useState } from "react";
import { CLASS_GROUPS, groupMonographsByClass } from "../data/derived";
import { getCatalogCollectionLabel } from "../data/topic-surface";
import { NAV_STATES } from "../styles/constants";
import { buildPathogenBreakpointPreset } from "../utils/breakpointWorkspacePreset";
import type {
  DiseaseCatalogSummary,
  MonographCatalogSummary,
  NavigateTo,
  PathogenReference,
  RecentView,
  Styles,
} from "../types";

interface HomePageProps {
  allMonographs: MonographCatalogSummary[];
  allergyCount: number;
  bookmarks: string[];
  diseaseStates: DiseaseCatalogSummary[];
  findMonographSummary: (id: string) => MonographCatalogSummary | null;
  navigateTo: NavigateTo;
  onOpenAllergyModal: () => void;
  onOpenPatientModal?: () => void;
  onOpenRecent: (recent: RecentView) => void;
  onStartCompare: () => void;
  recentViews: RecentView[];
  S: Styles;
  pathogens: PathogenReference[];
  theme: import("../types").ThemeKey;
  toggleBookmark: (id: string) => void;
  totalSubcategories: number;
}

export default function HomePage({
  allMonographs,
  allergyCount,
  bookmarks,
  diseaseStates,
  findMonographSummary,
  navigateTo,
  onOpenAllergyModal,
  onOpenRecent,
  onStartCompare,
  pathogens,
  recentViews,
  S,
  theme,
  toggleBookmark,
  totalSubcategories,
}: HomePageProps) {
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const monographsByClass = useMemo(() => groupMonographsByClass(allMonographs), [allMonographs]);

  const classPillBase = { ...S.crossRefPill, fontFamily: "inherit" } as const;
  const classPillActive = { ...classPillBase, background: S.meta.accentSurface, color: S.meta.accent, borderColor: S.meta.accent } as const;

  const drugPill = (drug: (typeof allMonographs)[number]) => (
    <button
      key={drug.id}
      type="button"
      className="mono-grid-card"
      style={{
        background: S.card.background,
        border: `1px solid ${S.card.borderColor}`,
        borderRadius: "9999px",
        padding: "8px 14px",
        color: S.meta.accent,
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: S.meta.shadowSm,
      }}
      onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: drug.parentDiseaseId, monographId: drug.id })}
    >
      {drug.name}
    </button>
  );

  const stats = [
    { label: "Clinical Topics", value: diseaseStates.length },
    { label: "Care Pathways", value: totalSubcategories },
    { label: "Drug Monographs", value: allMonographs.length },
  ];

  const quickActions = [
    {
      title: "Compare Drugs",
      detail: "Review two monographs side by side for quick class and safety tradeoffs.",
      icon: "⚖",
      meta: "Two-column view",
      onClick: onStartCompare,
    },
    {
      title: "Allergy Profile",
      detail: "Track allergies and interacting medications for inline warnings across therapy views.",
      icon: "⚠",
      meta: allergyCount > 0 ? `${allergyCount} active flag${allergyCount === 1 ? "" : "s"}` : "No active flags",
      onClick: onOpenAllergyModal,
    },
    {
      title: "Calculators",
      detail: "CrCl, IBW/AdjBW, CURB-65, PORT/PSI, Vancomycin AUC, and aminoglycoside dosing.",
      icon: "🧮",
      meta: "6 clinical tools",
      onClick: () => navigateTo(NAV_STATES.CALCULATORS),
    },
    {
      title: "Breakpoint Workspace",
      detail: "Sanity-check phenotype, site, and susceptibility signals before you lock in therapy.",
      icon: "🧬",
      meta: `${pathogens.length} pathogen refs`,
      onClick: () =>
        navigateTo(NAV_STATES.BREAKPOINTS, {
          pathogenId: pathogens[0]?.id ?? null,
          breakpointPreset: buildPathogenBreakpointPreset(pathogens[0]),
        }),
    },
    {
      title: "Data Audit",
      detail: "Check missing fields and broken content links before the dataset grows further.",
      icon: "🔍",
      meta: "Content integrity",
      onClick: () => navigateTo("audit"),
    },
  ];

  return (
    <>
      <section
        className="home-hero"
        style={{
          ...S.card,
          cursor: "default",
          padding: "28px",
          marginBottom: "28px",
          background:
            theme === "dark"
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.82) 50%, rgba(14, 116, 144, 0.18) 100%)"
              : "linear-gradient(135deg, rgba(255, 253, 249, 0.98) 0%, rgba(246, 249, 245, 0.96) 56%, rgba(224, 242, 254, 0.72) 100%)",
          borderColor: theme === "dark" ? "#36506e" : "#c6d3dc",
          overflow: "hidden",
        }}
      >
        <div className="home-hero-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "22px", alignItems: "stretch" }}>
          <div className="home-hero-copy">
            <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "12px", fontSize: "12px" }}>
              Clinical pharmacy reference
            </div>
            <h1 style={{ fontSize: "clamp(30px, 4vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.05em", margin: 0, color: S.meta.textHeading }}>
              Faster medication and care-pathway answers, with less visual noise.
            </h1>
            <p style={{ ...S.monographValue, maxWidth: "640px", marginTop: "16px", marginBottom: 0 }}>
              Evidence-based clinical pharmacy guidance organized by topic, pathway, pathogen, and drug monograph. Built for quick scanning on shift and deeper reading when you need the detail.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
              {["Clinical topics", "Drug detail", "Decision support"].map((item) => (
                <span
                  key={item}
                  style={{
                    ...S.crossRefPill,
                    cursor: "default",
                    marginRight: 0,
                    marginBottom: 0,
                    background: S.meta.accentSurface,
                    borderColor: `${S.meta.accent}35`,
                    color: S.meta.accent,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", alignContent: "start" }}>
            {stats.map((item) => (
              <div
                key={item.label}
                style={{
                  background: theme === "dark" ? "rgba(15, 23, 42, 0.56)" : "rgba(255, 255, 255, 0.74)",
                  border: `1px solid ${S.meta.border}`,
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: S.meta.shadowSm,
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em", color: S.meta.accent }}>{item.value}</div>
                <div style={{ ...S.monographLabel, marginBottom: 0 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="home-actions" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        {quickActions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="pr-card action-card"
            style={{
              ...S.card,
              marginBottom: 0,
              padding: "18px 20px",
              textAlign: "left",
              display: "grid",
              gap: "10px",
              minHeight: "124px",
            }}
            onClick={action.onClick}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <span
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: S.meta.accentSurface,
                  border: `1px solid ${S.meta.border}`,
                  fontSize: "18px",
                }}
              >
                {action.icon}
              </span>
              <span style={{ ...S.monographLabel, marginBottom: 0 }}>{action.meta}</span>
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: S.meta.textHeading }}>{action.title}</div>
            <div style={{ fontSize: "13px", lineHeight: 1.65, color: S.monographValue.color }}>{action.detail}</div>
          </button>
        ))}
      </div>

      {recentViews.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
            <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "12px" }}>Recent Views</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color }}>Resume the last pages you were using.</div>
          </div>
          <div className="home-recent-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px", marginBottom: "28px" }}>
            {recentViews.map((recent) => (
              <button
                key={`${recent.type}-${recent.label}`}
                type="button"
                className="pr-card recent-card"
                style={{ ...S.card, marginBottom: 0, textAlign: "left", padding: "16px 18px" }}
                onClick={() => onOpenRecent(recent)}
              >
                <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "6px" }}>
                  {recent.icon} {recent.type === "disease" ? "TOPIC" : recent.type === "subcategory" ? "PATHWAY" : recent.type.toUpperCase()}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: S.meta.textHeading }}>{recent.label}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>{recent.meta}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {bookmarks.length === 0 && (
        <div
          style={{
            ...S.card,
            cursor: "default",
            padding: "20px 22px",
            marginBottom: "28px",
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "8px", opacity: 0.5 }}>🔖</div>
          <p style={{ color: S.monographValue.color, margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
            No bookmarks yet — tap the bookmark icon on any monograph to save it here for quick access.
          </p>
        </div>
      )}

      {bookmarks.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
            <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "12px" }}>🔖 Bookmarks</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color }}>{bookmarks.length} saved item{bookmarks.length === 1 ? "" : "s"}</div>
          </div>
          <div className="home-recent-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px", marginBottom: "28px" }}>
            {bookmarks.map((id) => {
              const isDisease = id.startsWith("disease:");
              const isMonograph = id.startsWith("monograph:");
              const key = id.replace(/^(disease|monograph):/, "");
              if (isMonograph) {
                const found = findMonographSummary(key);
                if (!found) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    className="pr-card recent-card"
                    style={{ ...S.card, marginBottom: 0, textAlign: "left", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px" }}
                    onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { diseaseId: found.parentDiseaseId, monographId: found.id })}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "11px", color: S.meta.accent, fontWeight: 700 }}>💊 MONOGRAPH</div>
                      <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#fbbf24", fontSize: "14px", padding: "0 0 0 8px" }} onClick={(e) => { e.stopPropagation(); toggleBookmark(id); }} title="Remove bookmark">🔖</button>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{found.name}</div>
                    <div style={{ fontSize: "11px", color: S.monographValue.color }}>{found.parentDiseaseName}</div>
                  </button>
                );
              }
              if (isDisease) {
                const disease = diseaseStates.find((d) => d.id === key);
                if (!disease) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    className="pr-card recent-card"
                    style={{ ...S.card, marginBottom: 0, textAlign: "left", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px" }}
                    onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: disease.id })}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "11px", color: S.meta.accent, fontWeight: 700 }}>{disease.icon} TOPIC</div>
                      <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#fbbf24", fontSize: "14px", padding: "0 0 0 8px" }} onClick={(e) => { e.stopPropagation(); toggleBookmark(id); }} title="Remove bookmark">🔖</button>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>{disease.name}</div>
                    <div style={{ fontSize: "11px", color: S.monographValue.color }}>{disease.subcategoryCount} pathways</div>
                  </button>
                );
              }
              return null;
            })}
          </div>
        </>
      )}

      <div className="section-meta-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "13px" }}>{getCatalogCollectionLabel()}</div>
        <div style={{ fontSize: "12px", color: S.monographValue.color }}>Browse by topic first, then drill into care pathways, treatment approaches, and drug detail.</div>
      </div>
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
        {diseaseStates.map((disease) => (
          <div
            key={disease.id}
            className="pr-card disease-card"
            role="button"
            tabIndex={0}
            style={{ ...S.card, display: "flex", alignItems: "center", gap: "16px", marginBottom: 0, padding: "18px 20px" }}
            onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: disease.id })}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: disease.id }); } }}
          >
            <div
              style={{
                fontSize: "32px",
                width: "58px",
                height: "58px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: S.meta.accentSurface,
                borderRadius: "18px",
                border: `1px solid ${S.meta.border}`,
                flexShrink: 0,
              }}
            >
              {disease.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "17px", fontWeight: 700, color: S.meta.textHeading }}>{disease.name}</div>
              <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "5px", lineHeight: 1.55 }}>
                {disease.category}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                  {disease.subcategoryCount} pathways
                </span>
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                  {disease.monographCount} monographs
                </span>
              </div>
            </div>
            <div
              className="disease-card-arrow"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: S.meta.accentSurface,
                color: S.meta.accent,
                flexShrink: 0,
              }}
            >
              ›
            </div>
          </div>
        ))}
      </div>

      <div className="section-meta-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginTop: "30px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "13px" }}>Pathogen References</div>
        <div style={{ fontSize: "12px", color: S.monographValue.color }}>Jump from phenotype and rapid diagnostics to the right monograph and syndrome context.</div>
      </div>
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
        {pathogens.map((pathogen) => (
          <button
            key={pathogen.id}
            type="button"
            className="pr-card disease-card"
            style={{ ...S.card, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", marginBottom: 0, padding: "18px 20px", textAlign: "left" }}
            onClick={() => navigateTo(NAV_STATES.PATHOGEN, { pathogenId: pathogen.id })}
          >
            <div style={{ fontSize: "11px", color: S.meta.accent, fontWeight: 700 }}>🧬 PATHOGEN</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{pathogen.name}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.55 }}>{pathogen.phenotype}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
              {pathogen.likelySyndromes.slice(0, 2).map((syndrome) => (
                <span key={`${pathogen.id}-${syndrome}`} style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                  {syndrome}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginTop: "30px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ ...S.monographLabel, marginBottom: 0, fontSize: "13px" }}>All Drug Monographs ({allMonographs.length})</div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "16px" }}>
        <button type="button" style={activeClass === null ? classPillActive : classPillBase} onClick={() => setActiveClass(null)}>
          All Classes
        </button>
        {CLASS_GROUPS.filter((g) => (monographsByClass[g.label] ?? []).length > 0).map((g) => (
          <button
            key={g.label}
            type="button"
            style={activeClass === g.label ? classPillActive : classPillBase}
            onClick={() => setActiveClass(g.label)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {activeClass !== null ? (
        <div className="monograph-pills" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(monographsByClass[activeClass] ?? []).map(drugPill)}
        </div>
      ) : (
        <>
          {CLASS_GROUPS.filter((g) => (monographsByClass[g.label] ?? []).length > 0).map((g) => (
            <div key={g.label} style={{ marginBottom: "20px" }}>
              <div style={{ ...S.monographLabel, fontSize: "11px", marginBottom: "8px" }}>{g.label}</div>
              <div className="monograph-pills" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {monographsByClass[g.label].map(drugPill)}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
