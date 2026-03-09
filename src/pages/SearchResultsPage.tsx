import { useState, type ReactNode } from "react";
import { NAV_STATES } from "../styles/constants";
import type { NavStateKey, SearchResult, Styles, Subcategory, MonographLookupResult } from "../types";

type TabLabel = "All" | "Drugs" | "Organisms" | "Syndromes" | "Diseases";
const ALL_TABS: TabLabel[] = ["All", "Drugs", "Organisms", "Syndromes", "Diseases"];
const TAB_GROUPS: Record<string, string> = {
  Drugs: "Drug Monographs",
  Organisms: "Organisms",
  Syndromes: "Subcategories",
  Diseases: "Disease States",
};

const DEFAULT_VISIBLE = 4;

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatch(text: string, query: string, accentSurface: string, accent: string): ReactNode {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} style={{ background: accentSurface, color: accent, borderRadius: "3px", padding: "0 2px" }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

interface SearchResultsPageProps {
  query: string;
  results: SearchResult;
  navigateTo: (state: NavStateKey, data?: Partial<MonographLookupResult> & { subcategory?: Subcategory }) => void;
  onClearSearch: () => void;
  S: Styles;
}

export default function SearchResultsPage({ query, results, navigateTo, onClearSearch, S }: SearchResultsPageProps) {
  const [activeTab, setActiveTab] = useState<TabLabel>("All");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const total = results.diseases.length + results.drugs.length + results.organisms.length + results.subcategories.length;
  const hl = (text: string) => highlightMatch(text, query, S.meta.accentSurface, S.meta.accent);

  const pillBase: React.CSSProperties = { ...S.crossRefPill, fontFamily: "inherit" };
  const pillActive: React.CSSProperties = {
    ...pillBase,
    background: S.meta.accentSurface,
    color: S.meta.accent,
    borderColor: S.meta.accent,
  };

  const groups = [
    {
      title: "Drug Monographs",
      items: results.drugs.map((drug) => (
        <div
          key={drug.id}
          className="pr-card result-card"
          style={{ ...S.card, marginBottom: 0, padding: "18px 20px" }}
          onClick={() => {
            onClearSearch();
            navigateTo(NAV_STATES.MONOGRAPH, { disease: drug.parentDisease, monograph: drug });
          }}
        >
          <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "6px" }}>💊 Drug Monograph</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{hl(drug.name)}</div>
          <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
            {drug.brandNames} · {drug.drugClass}
          </div>
        </div>
      )),
    },
    {
      title: "Organisms",
      items: results.organisms.map((organism, index) => (
        <div
          key={`${organism.parentDisease.id}-${organism.parentSubcategory.id}-${index}`}
          className="pr-card result-card"
          style={{ ...S.card, marginBottom: 0, padding: "18px 20px" }}
          onClick={() => {
            onClearSearch();
            navigateTo(NAV_STATES.SUBCATEGORY, {
              disease: organism.parentDisease,
              subcategory: organism.parentSubcategory,
            });
          }}
        >
          <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "6px" }}>🦠 Organism</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{hl(organism.organism)}</div>
          <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
            {organism.parentDisease.name}
            <span style={{ color: S.meta.accent, margin: "0 5px" }}>›</span>
            {organism.parentSubcategory.name}
          </div>
          {organism.preferred && (
            <div
              style={{
                fontSize: "12px",
                color: S.meta.textMuted,
                marginTop: "5px",
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.4,
              }}
            >
              Preferred: {organism.preferred.length > 80 ? organism.preferred.slice(0, 77) + "…" : organism.preferred}
            </div>
          )}
        </div>
      )),
    },
    {
      title: "Subcategories",
      items: results.subcategories.map((subcategory) => (
        <div
          key={`${subcategory.parentDisease.id}-${subcategory.id}`}
          className="pr-card result-card"
          style={{ ...S.card, marginBottom: 0, padding: "18px 20px" }}
          onClick={() => {
            onClearSearch();
            navigateTo(NAV_STATES.SUBCATEGORY, { disease: subcategory.parentDisease, subcategory });
          }}
        >
          <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "6px" }}>
            📋{" "}
            {subcategory.matchType === "name"
              ? "Matched in title"
              : subcategory.matchType === "pearl"
                ? "Matched in pearls"
                : "Matched in therapy"}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{hl(subcategory.name)}</div>
          <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px" }}>
            {subcategory.parentDisease.name}
          </div>
        </div>
      )),
    },
    {
      title: "Disease States",
      items: results.diseases.map((disease) => (
        <div
          key={disease.id}
          className="pr-card result-card"
          style={{ ...S.card, marginBottom: 0, padding: "18px 20px" }}
          onClick={() => {
            onClearSearch();
            navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease });
          }}
        >
          <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "6px" }}>🔬 Disease State</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>
            {disease.icon} {hl(disease.name)}
          </div>
        </div>
      )),
    },
  ].filter((group) => group.items.length > 0);

  const visibleTabs = ALL_TABS.filter((tab) => tab === "All" || groups.some((g) => g.title === TAB_GROUPS[tab]));
  const filteredGroups = activeTab === "All" ? groups : groups.filter((g) => g.title === TAB_GROUPS[activeTab]);

  return (
    <>
      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "20px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Search Results</div>
          <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>
            {total} result{total === 1 ? "" : "s"} for "{query}"
          </h1>
          <p style={{ color: S.monographValue.color, fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
            Results are grouped by content type so you can jump to the right level quickly.
          </p>
        </div>
      </section>

      {visibleTabs.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {visibleTabs.map((tab) => (
            <button key={tab} style={activeTab === tab ? pillActive : pillBase} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
      )}

      {filteredGroups.map((group) => {
        const isExpanded = !!expanded[group.title];
        const visible = isExpanded ? group.items : group.items.slice(0, DEFAULT_VISIBLE);
        const hiddenCount = group.items.length - DEFAULT_VISIBLE;

        return (
          <section key={group.title} style={{ marginBottom: "26px" }}>
            <div style={{ ...S.monographLabel, fontSize: "12px", marginBottom: "10px" }}>{group.title}</div>
            <div
              className="results-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}
            >
              {visible}
            </div>
            {hiddenCount > 0 && !isExpanded && (
              <button
                style={{ ...S.expandAllBtn, marginTop: "10px" }}
                onClick={() => setExpanded((prev) => ({ ...prev, [group.title]: true }))}
              >
                Show {hiddenCount} more
              </button>
            )}
            {isExpanded && group.items.length > DEFAULT_VISIBLE && (
              <button
                style={{ ...S.expandAllBtn, marginTop: "10px" }}
                onClick={() => setExpanded((prev) => ({ ...prev, [group.title]: false }))}
              >
                Show less
              </button>
            )}
          </section>
        );
      })}

      {total === 0 && (
        <div style={{ ...S.card, cursor: "default", textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>⌕</div>
          <p style={{ color: S.monographValue.color, margin: 0 }}>No results found. Try a different search term.</p>
        </div>
      )}
    </>
  );
}
