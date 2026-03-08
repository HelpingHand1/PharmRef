import { NAV_STATES } from "../styles/constants";
import type { NavStateKey, SearchResult, Styles, Subcategory, MonographLookupResult } from "../types";

interface SearchResultsPageProps {
  query: string;
  results: SearchResult;
  limit: number;
  navigateTo: (state: NavStateKey, data?: Partial<MonographLookupResult> & { subcategory?: Subcategory }) => void;
  onClearSearch: () => void;
  S: Styles;
}

export default function SearchResultsPage({
  query,
  results,
  limit,
  navigateTo,
  onClearSearch,
  S,
}: SearchResultsPageProps) {
  const total = results.diseases.length + results.drugs.length + results.organisms.length + results.subcategories.length;
  const groups = [
    {
      title: "Drug Monographs",
      items: results.drugs.slice(0, limit).map((drug) => (
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
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{drug.name}</div>
          <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
            {drug.brandNames} · {drug.drugClass}
          </div>
        </div>
      )),
    },
    {
      title: "Organisms",
      items: results.organisms.slice(0, limit).map((organism, index) => (
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
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{organism.organism}</div>
          <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
            {organism.parentSubcategory.name} · {organism.parentDisease.name}
          </div>
        </div>
      )),
    },
    {
      title: "Subcategories",
      items: results.subcategories.slice(0, limit).map((subcategory) => (
        <div
          key={`${subcategory.parentDisease.id}-${subcategory.id}`}
          className="pr-card result-card"
          style={{ ...S.card, marginBottom: 0, padding: "18px 20px" }}
          onClick={() => {
            onClearSearch();
            navigateTo(NAV_STATES.SUBCATEGORY, {
              disease: subcategory.parentDisease,
              subcategory,
            });
          }}
        >
          <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "6px" }}>
            📋 {subcategory.matchType === "name" ? "Matched in title" : subcategory.matchType === "pearl" ? "Matched in pearls" : "Matched in therapy"}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: S.meta.textHeading }}>{subcategory.name}</div>
          <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "6px" }}>{subcategory.parentDisease.name}</div>
        </div>
      )),
    },
    {
      title: "Disease States",
      items: results.diseases.slice(0, limit).map((disease) => (
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
            {disease.icon} {disease.name}
          </div>
        </div>
      )),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "20px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Search Results</div>
          <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta.textHeading }}>
            {total} result{total === 1 ? "" : "s"} for "{query}"
          </h1>
          {total > limit * 4 ? (
            <p style={{ color: S.monographValue.color, fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
              Showing the first {limit} matches per section for faster scanning.
            </p>
          ) : (
            <p style={{ color: S.monographValue.color, fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
              Results are grouped by content type so you can jump to the right level quickly.
            </p>
          )}
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.title} style={{ marginBottom: "26px" }}>
          <div style={{ ...S.monographLabel, fontSize: "12px", marginBottom: "10px" }}>{group.title}</div>
          <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>{group.items}</div>
        </section>
      ))}

      {total === 0 && (
        <div style={{ ...S.card, cursor: "default", textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>⌕</div>
          <p style={{ color: S.monographValue.color, margin: 0 }}>No results found. Try a different search term.</p>
        </div>
      )}
    </>
  );
}
