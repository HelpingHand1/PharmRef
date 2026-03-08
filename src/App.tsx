import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  AllergyRecord,
  DiseaseState,
  DrugMonograph,
  MonographLookupResult,
  NavStateKey,
  OrganismSpecific,
  Subcategory,
} from "./types";
import { DISEASE_STATES } from "./data";
import { NAV_STATES, aeCard, aeLabel, applyThemeVars, makeStyles } from "./styles/constants";
import { usePersistedState } from "./utils/persistence";
import {
  AllergyModal,
  AllergyWarning,
  AuditView,
  CompareView,
  CrossRefBadges,
  DisclaimerModal,
  EmpiricTierView,
  Section,
  Toast,
} from "./components";

type SearchResult = {
  diseases: DiseaseState[];
  drugs: Array<DrugMonograph & { parentDisease: DiseaseState }>;
  organisms: Array<OrganismSpecific & { parentDisease: DiseaseState; parentSubcategory: Subcategory }>;
  subcategories: Array<Subcategory & { parentDisease: DiseaseState; matchType: "name" | "pearl" | "empiric" }>;
};

type SearchEntry =
  | { type: "disease"; disease: DiseaseState; text: string }
  | {
      type: "subcategory";
      disease: DiseaseState;
      subcategory: Subcategory;
      text: string;
      matchClassify: (query: string) => "name" | "pearl" | "empiric";
    }
  | { type: "organism"; disease: DiseaseState; subcategory: Subcategory; organism: OrganismSpecific; text: string }
  | { type: "drug"; disease: DiseaseState; drug: DrugMonograph; text: string };

const ALL_MONOGRAPHS: Array<DrugMonograph & { parentDisease: DiseaseState }> = (() => {
  const seen = new Set<string>();
  const list: Array<DrugMonograph & { parentDisease: DiseaseState }> = [];

  DISEASE_STATES.forEach((disease) => {
    disease.drugMonographs.forEach((monograph) => {
      if (seen.has(monograph.id)) return;
      seen.add(monograph.id);
      list.push({ ...monograph, parentDisease: disease });
    });
  });

  return list.sort((left, right) => left.name.localeCompare(right.name));
})();

const TOTAL_SUBCATEGORIES = DISEASE_STATES.reduce((count, disease) => count + disease.subcategories.length, 0);

const MONOGRAPH_XREF: Record<string, DiseaseState[]> = (() => {
  const lookup: Record<string, DiseaseState[]> = {};

  DISEASE_STATES.forEach((disease) => {
    disease.drugMonographs.forEach((monograph) => {
      lookup[monograph.id] ??= [];
      lookup[monograph.id].push(disease);
    });
  });

  return lookup;
})();

const SEARCH_INDEX: SearchEntry[] = (() => {
  const entries: SearchEntry[] = [];

  DISEASE_STATES.forEach((disease) => {
    entries.push({
      type: "disease",
      disease,
      text: [disease.name, disease.overview.definition, disease.category].filter(Boolean).join(" ").toLowerCase(),
    });

    disease.subcategories.forEach((subcategory) => {
      const searchTexts = [subcategory.name, subcategory.definition, ...(subcategory.pearls ?? [])];
      subcategory.empiricTherapy?.forEach((tier) => {
        searchTexts.push(tier.line);
        tier.options.forEach((option) => {
          searchTexts.push(option.regimen);
          searchTexts.push(option.notes ?? "");
        });
      });
      subcategory.organismSpecific?.forEach((organism) => {
        searchTexts.push(organism.organism, organism.notes ?? "", organism.preferred ?? "", organism.alternative ?? "");
      });

      entries.push({
        type: "subcategory",
        disease,
        subcategory,
        text: searchTexts.filter(Boolean).join(" ").toLowerCase(),
        matchClassify: (query) => {
          if (subcategory.name.toLowerCase().includes(query) || subcategory.definition.toLowerCase().includes(query)) {
            return "name";
          }
          if (subcategory.pearls?.some((pearl) => pearl.toLowerCase().includes(query))) {
            return "pearl";
          }
          return "empiric";
        },
      });

      subcategory.organismSpecific?.forEach((organism) => {
        entries.push({
          type: "organism",
          disease,
          subcategory,
          organism,
          text: [organism.organism, organism.preferred, organism.alternative, organism.notes]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        });
      });
    });

    disease.drugMonographs.forEach((drug) => {
      entries.push({
        type: "drug",
        disease,
        drug,
        text: [
          drug.name,
          drug.brandNames,
          drug.drugClass,
          drug.spectrum,
          drug.mechanismOfAction,
          ...(drug.pharmacistPearls ?? []),
          ...(drug.drugInteractions ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      });
    });
  });

  return entries;
})();

function findMonograph(drugId: string): MonographLookupResult | null {
  for (const disease of DISEASE_STATES) {
    const monograph = disease.drugMonographs.find((drug) => drug.id === drugId);
    if (monograph) {
      return { monograph, disease };
    }
  }

  return null;
}

function stateToHash(
  navState: NavStateKey,
  disease: DiseaseState | null,
  subcategory: Subcategory | null,
  monograph: DrugMonograph | null,
): string {
  if (navState === "audit") return "#/audit";
  if (navState === NAV_STATES.COMPARE) return "#/compare";
  if (navState === NAV_STATES.MONOGRAPH && disease && monograph) return `#/${disease.id}/drug/${monograph.id}`;
  if (navState === NAV_STATES.SUBCATEGORY && disease && subcategory) return `#/${disease.id}/${subcategory.id}`;
  if (navState === NAV_STATES.DISEASE_OVERVIEW && disease) return `#/${disease.id}`;
  return "#/";
}

function hashToState(hash: string): {
  nav: NavStateKey;
  disease: DiseaseState | null;
  subcategory: Subcategory | null;
  monograph: DrugMonograph | null;
} {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts.length === 0) {
    return { nav: NAV_STATES.HOME, disease: null, subcategory: null, monograph: null };
  }

  if (parts[0] === "compare") {
    return { nav: NAV_STATES.COMPARE, disease: null, subcategory: null, monograph: null };
  }

  if (parts[0] === "audit") {
    return { nav: "audit", disease: null, subcategory: null, monograph: null };
  }

  const disease = DISEASE_STATES.find((entry) => entry.id === parts[0]) ?? null;
  if (!disease) {
    return { nav: NAV_STATES.HOME, disease: null, subcategory: null, monograph: null };
  }

  if (parts.length === 1) {
    return { nav: NAV_STATES.DISEASE_OVERVIEW, disease, subcategory: null, monograph: null };
  }

  if (parts[1] === "drug" && parts[2]) {
    const monograph = disease.drugMonographs.find((entry) => entry.id === parts[2]) ?? null;
    if (monograph) {
      return { nav: NAV_STATES.MONOGRAPH, disease, subcategory: null, monograph };
    }
  }

  const subcategory = disease.subcategories.find((entry) => entry.id === parts[1]) ?? null;
  if (subcategory) {
    return { nav: NAV_STATES.SUBCATEGORY, disease, subcategory, monograph: null };
  }

  return { nav: NAV_STATES.DISEASE_OVERVIEW, disease, subcategory: null, monograph: null };
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

export default function PharmRef() {
  const [navState, setNavState] = useState<NavStateKey>(NAV_STATES.HOME);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseState | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedMonograph, setSelectedMonograph] = useState<DrugMonograph | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [theme, setTheme] = usePersistedState<"dark" | "light">("theme", "dark");
  const [allergies, setAllergies] = usePersistedState<AllergyRecord[]>("allergies", []);
  const [readingMode, setReadingMode] = usePersistedState<boolean>("readingMode", false);
  const [toast, setToast] = useState<{ message: string; icon: string; leaving?: boolean } | null>(null);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergySeverity, setAllergySeverity] = useState("mild");
  const [compareItems, setCompareItems] = usePersistedState<string[]>("compareItems", []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const copiedTimerRef = useRef<number | null>(null);
  const isHashNavigation = useRef(false);
  const S = useMemo(() => makeStyles(theme), [theme]);

  useEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if (localStorage.getItem("pharmref_theme") === null) {
        setTheme(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", syncSystemTheme);
    syncSystemTheme();

    return () => media.removeEventListener("change", syncSystemTheme);
  }, [setTheme]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), 150);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const applyHash = () => {
      isHashNavigation.current = true;
      const next = hashToState(window.location.hash || "#/");
      setNavState(next.nav);
      setSelectedDisease(next.disease);
      setSelectedSubcategory(next.subcategory);
      setSelectedMonograph(next.monograph);
      setExpandedSections({});
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);

    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (isHashNavigation.current) {
      isHashNavigation.current = false;
      return;
    }

    const nextHash = stateToHash(navState, selectedDisease, selectedSubcategory, selectedMonograph);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [navState, selectedDisease, selectedSubcategory, selectedMonograph]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(activeTag ?? "")) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
    },
    [],
  );

  const showToast = useCallback((message: string, icon = "ℹ") => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ message, icon, leaving: false });
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => (current ? { ...current, leaving: true } : current));
      toastTimerRef.current = window.setTimeout(() => setToast(null), 250);
    }, 2200);
  }, []);

  const navigateTo = useCallback(
    (
      state: NavStateKey,
      data: Partial<MonographLookupResult> & { subcategory?: Subcategory } = {},
    ) => {
      setNavState(state);

      if (state === NAV_STATES.HOME || state === NAV_STATES.COMPARE || state === "audit") {
        setSelectedDisease(null);
        setSelectedSubcategory(null);
        setSelectedMonograph(null);
      }

      if (data.disease !== undefined) {
        setSelectedDisease(data.disease ?? null);
      } else if (state === NAV_STATES.DISEASE_OVERVIEW) {
        setSelectedDisease(selectedDisease);
      }

      if (state === NAV_STATES.DISEASE_OVERVIEW) {
        setSelectedSubcategory(null);
        setSelectedMonograph(null);
      }

      if (data.subcategory !== undefined) {
        setSelectedSubcategory(data.subcategory ?? null);
      } else if (state !== NAV_STATES.SUBCATEGORY) {
        setSelectedSubcategory(null);
      }

      if (data.monograph !== undefined) {
        setSelectedMonograph(data.monograph ?? null);
      } else if (state !== NAV_STATES.MONOGRAPH) {
        setSelectedMonograph(null);
      }

      setExpandedSections({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [selectedDisease],
  );

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const currentSectionIds = useMemo(() => {
    if (navState === NAV_STATES.DISEASE_OVERVIEW) return ["overview", "guidelines", "trials"];
    if (navState === NAV_STATES.SUBCATEGORY) return ["presentation", "diagnostics", "empiric", "organism", "pearls"];
    if (navState === NAV_STATES.MONOGRAPH) {
      return ["moa", "spectrum", "dosing", "renal", "hepatic", "ae", "interactions", "monitoring", "pregnancy", "pharm-pearls"];
    }
    return [];
  }, [navState]);

  const expandAll = useCallback(() => {
    setExpandedSections((current) => {
      const next = { ...current };
      currentSectionIds.forEach((id) => {
        next[id] = true;
      });
      return next;
    });
  }, [currentSectionIds]);

  const collapseAll = useCallback(() => {
    setExpandedSections((current) => {
      const next = { ...current };
      currentSectionIds.forEach((id) => {
        next[id] = false;
      });
      return next;
    });
  }, [currentSectionIds]);

  const handleCopy = useCallback(
    async (text: string, id: string) => {
      const ok = await copyToClipboard(text);
      if (!ok) {
        showToast("Clipboard unavailable", "⚠");
        return;
      }

      setCopiedId(id);
      showToast("Copied to clipboard", "⎘");
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => setCopiedId(null), 1400);
    },
    [showToast],
  );

  const addAllergy = useCallback(() => {
    const value = allergyInput.trim();
    if (!value) return;

    setAllergies((current) => {
      const normalized = value.toLowerCase();
      const next = current.filter((item) => item.name.toLowerCase() !== normalized);
      return [...next, { name: value, severity: allergySeverity }];
    });
    setAllergyInput("");
    showToast(`Saved ${value}`, "⚠");
  }, [allergyInput, allergySeverity, setAllergies, showToast]);

  const removeAllergy = useCallback(
    (name: string) => {
      setAllergies((current) => current.filter((item) => item.name !== name));
      showToast(`Removed ${name}`, "🗑");
    },
    [setAllergies, showToast],
  );

  const searchResults = useMemo<SearchResult | null>(() => {
    if (debouncedQuery.length < 2) return null;

    const results: SearchResult = { diseases: [], drugs: [], organisms: [], subcategories: [] };
    const seenDiseases = new Set<string>();
    const seenDrugs = new Set<string>();
    const seenOrganisms = new Set<string>();
    const seenSubcategories = new Set<string>();

    SEARCH_INDEX.forEach((entry) => {
      if (!entry.text.includes(debouncedQuery.toLowerCase())) return;

      if (entry.type === "disease") {
        if (!seenDiseases.has(entry.disease.id)) {
          seenDiseases.add(entry.disease.id);
          results.diseases.push(entry.disease);
        }
        return;
      }

      if (entry.type === "drug") {
        if (!seenDrugs.has(entry.drug.id)) {
          seenDrugs.add(entry.drug.id);
          results.drugs.push({ ...entry.drug, parentDisease: entry.disease });
        }
        return;
      }

      if (entry.type === "organism") {
        const key = `${entry.disease.id}:${entry.subcategory.id}:${entry.organism.organism}`;
        if (!seenOrganisms.has(key)) {
          seenOrganisms.add(key);
          results.organisms.push({
            ...entry.organism,
            parentDisease: entry.disease,
            parentSubcategory: entry.subcategory,
          });
        }
        return;
      }

      const key = `${entry.disease.id}:${entry.subcategory.id}`;
      if (!seenSubcategories.has(key)) {
        seenSubcategories.add(key);
        results.subcategories.push({
          ...entry.subcategory,
          parentDisease: entry.disease,
          matchType: entry.matchClassify(debouncedQuery.toLowerCase()),
        });
      }
    });

    return results;
  }, [debouncedQuery]);

  const breadcrumbs = useMemo(() => {
    const trail: Array<{ label: string; action?: () => void }> = [{ label: "PharmRef", action: () => navigateTo(NAV_STATES.HOME) }];

    if (navState === NAV_STATES.COMPARE) {
      trail.push({ label: "Compare" });
      return trail;
    }

    if (navState === "audit") {
      trail.push({ label: "Audit" });
      return trail;
    }

    if (selectedDisease && navState !== NAV_STATES.HOME) {
      trail.push({
        label: selectedDisease.name,
        action: () => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease }),
      });
    }

    if (selectedSubcategory && navState === NAV_STATES.SUBCATEGORY) {
      trail.push({ label: selectedSubcategory.name });
    }

    if (selectedMonograph && navState === NAV_STATES.MONOGRAPH) {
      trail.push({ label: selectedMonograph.name });
    }

    return trail;
  }, [navState, navigateTo, selectedDisease, selectedMonograph, selectedSubcategory]);

  const compareDrugs = useMemo(
    () =>
      compareItems
        .map((drugId) => findMonograph(drugId))
        .filter((entry): entry is MonographLookupResult => entry !== null),
    [compareItems],
  );

  const ExpandCollapseBar = useCallback(
    () =>
      currentSectionIds.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginBottom: "8px" }}>
          <button style={S.expandAllBtn} onClick={expandAll}>
            Expand All
          </button>
          <button style={S.expandAllBtn} onClick={collapseAll}>
            Collapse All
          </button>
        </div>
      ) : null,
    [S.expandAllBtn, collapseAll, currentSectionIds.length, expandAll],
  );

  const Layout = useCallback(
    ({ children, compact = false }: { children: ReactNode; compact?: boolean }) => (
      <div style={S.app} className={readingMode ? "reading-mode" : undefined}>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <header style={S.header}>
          <div style={S.headerTop}>
            <button
              type="button"
              style={{ ...S.logo, background: "none", border: "none", fontFamily: "inherit" }}
              onClick={() => {
                setSearchQuery("");
                navigateTo(NAV_STATES.HOME);
              }}
            >
              <span>⚕</span> PharmRef <span style={S.logoPill}>Rx</span>
            </button>
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>⌕</span>
              <input
                ref={searchRef}
                className="search-input"
                style={{ ...S.searchBox, ...(compact ? { maxWidth: "320px" } : {}) }}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search drugs, organisms, pearls..."
              />
              {searchQuery ? (
                <button type="button" style={S.clearBtn} onClick={() => setSearchQuery("")} title="Clear search">
                  ✕
                </button>
              ) : (
                <span style={S.kbdHint}>/</span>
              )}
            </div>
            <div style={S.headerToolbar}>
              <button
                type="button"
                style={S.expandAllBtn}
                onClick={() => setReadingMode((current) => !current)}
                title="Toggle reading mode"
              >
                {readingMode ? "Exit Reading" : "Reading Mode"}
              </button>
              <button
                type="button"
                style={S.themeToggle}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle theme"
              >
                {theme === "dark" ? "☀" : "☾"}
              </button>
            </div>
          </div>
          {navState !== NAV_STATES.HOME && (
            <div style={S.breadcrumbs}>
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {index > 0 && <span>›</span>}
                  {crumb.action ? (
                    <button type="button" style={S.breadcrumbLink} onClick={crumb.action}>
                      {crumb.label}
                    </button>
                  ) : (
                    <span style={{ color: S.monographValue.color }}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </header>
        <main style={S.main}>{children}</main>
        {showTopBtn && (
          <button
            type="button"
            className="top-btn"
            style={S.topBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Back to top"
          >
            ↑
          </button>
        )}
        <Toast toast={toast} S={S} />
        <AllergyModal
          show={showAllergyModal}
          onClose={() => setShowAllergyModal(false)}
          theme={theme}
          allergies={allergies}
          allergyInput={allergyInput}
          setAllergyInput={setAllergyInput}
          allergySeverity={allergySeverity}
          setAllergySeverity={setAllergySeverity}
          addAllergy={addAllergy}
          removeAllergy={removeAllergy}
        />
        <DisclaimerModal S={S} />
      </div>
    ),
    [
      S,
      addAllergy,
      allergies,
      allergyInput,
      allergySeverity,
      breadcrumbs,
      navState,
      navigateTo,
      readingMode,
      searchQuery,
      setTheme,
      showAllergyModal,
      showTopBtn,
      theme,
      toast,
    ],
  );

  if (searchResults) {
    const total =
      searchResults.diseases.length +
      searchResults.drugs.length +
      searchResults.organisms.length +
      searchResults.subcategories.length;

    return (
      <Layout>
        <p style={{ color: S.monographValue.color, fontSize: "13px", marginBottom: "20px" }}>
          {total} result{total === 1 ? "" : "s"} for "{debouncedQuery}"
        </p>

        {searchResults.drugs.map((drug) => (
          <div
            key={drug.id}
            className="pr-card"
            style={S.card}
            onClick={() => {
              setSearchQuery("");
              navigateTo(NAV_STATES.MONOGRAPH, { disease: drug.parentDisease, monograph: drug });
            }}
          >
            <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "4px" }}>💊 DRUG MONOGRAPH</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{drug.name}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px" }}>
              {drug.brandNames} · {drug.drugClass}
            </div>
          </div>
        ))}

        {searchResults.organisms.map((organism, index) => (
          <div
            key={`${organism.parentDisease.id}-${organism.parentSubcategory.id}-${index}`}
            className="pr-card"
            style={S.card}
            onClick={() => {
              setSearchQuery("");
              navigateTo(NAV_STATES.SUBCATEGORY, {
                disease: organism.parentDisease,
                subcategory: organism.parentSubcategory,
              });
            }}
          >
            <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "4px" }}>🦠 ORGANISM</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{organism.organism}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px" }}>
              {organism.parentSubcategory.name} · {organism.parentDisease.name}
            </div>
          </div>
        ))}

        {searchResults.subcategories.map((subcategory) => (
          <div
            key={`${subcategory.parentDisease.id}-${subcategory.id}`}
            className="pr-card"
            style={S.card}
            onClick={() => {
              setSearchQuery("");
              navigateTo(NAV_STATES.SUBCATEGORY, {
                disease: subcategory.parentDisease,
                subcategory,
              });
            }}
          >
            <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "4px" }}>
              📋 {subcategory.matchType === "name" ? "MATCHED IN TITLE" : subcategory.matchType === "pearl" ? "MATCHED IN PEARLS" : "MATCHED IN THERAPY"}
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{subcategory.name}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px" }}>{subcategory.parentDisease.name}</div>
          </div>
        ))}

        {searchResults.diseases.map((disease) => (
          <div
            key={disease.id}
            className="pr-card"
            style={S.card}
            onClick={() => {
              setSearchQuery("");
              navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease });
            }}
          >
            <div style={{ fontSize: "11px", color: S.monographLabel.color, marginBottom: "4px" }}>🔬 DISEASE STATE</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>
              {disease.icon} {disease.name}
            </div>
          </div>
        ))}

        {total === 0 && (
          <p style={{ color: S.monographValue.color, textAlign: "center", padding: "40px 0" }}>
            No results found. Try a different search term.
          </p>
        )}
      </Layout>
    );
  }

  if (navState === NAV_STATES.HOME) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "26px 0 18px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: theme === "dark" ? "#f1f5f9" : "#0f172a", marginBottom: "10px" }}>
            Clinical Antibiotic Reference
          </h1>
          <p style={{ color: S.monographValue.color, fontSize: "14px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
            Evidence-based antimicrobial guidance organized by syndrome, organism, and drug monograph.
          </p>
        </div>

        <div className="stat-row" style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "16px 0 28px", flexWrap: "wrap" }}>
          {[
            { label: "Disease States", value: DISEASE_STATES.length },
            { label: "Subcategories", value: TOTAL_SUBCATEGORIES },
            { label: "Drug Monographs", value: ALL_MONOGRAPHS.length },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: theme === "dark" ? "#38bdf8" : "#0284c7" }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: S.monographLabel.color, letterSpacing: "0.5px", textTransform: "uppercase" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="pr-card"
            style={{ ...S.card, marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }}
            onClick={() => {
              setCompareItems([]);
              navigateTo(NAV_STATES.COMPARE);
            }}
          >
            ⚖ Compare Drugs
          </button>
          <button
            type="button"
            className="pr-card"
            style={{ ...S.card, marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }}
            onClick={() => setShowAllergyModal(true)}
          >
            ⚠ Allergy Profile {allergies.length > 0 ? `(${allergies.length})` : ""}
          </button>
          <button
            type="button"
            className="pr-card"
            style={{ ...S.card, marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }}
            onClick={() => navigateTo("audit")}
          >
            🔍 Data Audit
          </button>
        </div>

        <div style={{ ...S.monographLabel, marginBottom: "12px", fontSize: "13px" }}>Disease States</div>
        <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
          {DISEASE_STATES.map((disease) => (
            <div
              key={disease.id}
              className="pr-card"
              style={{ ...S.card, display: "flex", alignItems: "center", gap: "16px", marginBottom: 0 }}
              onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease })}
            >
              <div
                style={{
                  fontSize: "32px",
                  width: "52px",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: theme === "dark" ? "#0ea5e915" : "#0284c712",
                  borderRadius: "12px",
                  flexShrink: 0,
                }}
              >
                {disease.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>{disease.name}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.5 }}>
                  {disease.category} · {disease.subcategories.length} subcategories · {disease.drugMonographs.length} monographs
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "10px", fontSize: "12px" }}>
          All Drug Monographs ({ALL_MONOGRAPHS.length})
        </div>
        <div className="monograph-pills" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {ALL_MONOGRAPHS.map((drug) => (
            <button
              key={drug.id}
              type="button"
              style={{
                background: S.card.background,
                border: `1px solid ${S.card.borderColor}`,
                borderRadius: "6px",
                padding: "6px 12px",
                color: theme === "dark" ? "#38bdf8" : "#0284c7",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: drug.parentDisease, monograph: drug })}
            >
              {drug.name}
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  if (navState === NAV_STATES.COMPARE) {
    return (
      <Layout compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        <CompareView
          drugs={compareDrugs}
          compareItems={compareItems}
          setCompareItems={setCompareItems}
          allMonographs={ALL_MONOGRAPHS}
          ExpandCollapseBar={ExpandCollapseBar}
          S={S}
        />
      </Layout>
    );
  }

  if (navState === "audit") {
    return (
      <Layout compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        <AuditView diseaseStates={DISEASE_STATES} findMonograph={findMonograph} S={S} />
      </Layout>
    );
  }

  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    const overview = selectedDisease.overview;

    return (
      <Layout compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← All Disease States
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>
          {selectedDisease.icon} {selectedDisease.name}
        </h1>
        <div style={{ color: S.monographValue.color, fontSize: "13px", marginBottom: "20px" }}>{selectedDisease.category}</div>
        <ExpandCollapseBar />

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
          <p style={{ ...S.monographValue, marginBottom: "12px" }}>{overview.definition}</p>
          {overview.epidemiology && <p style={{ ...S.monographValue, marginBottom: "12px" }}>{overview.epidemiology}</p>}
          {overview.riskFactors && (
            <>
              <div style={{ ...S.monographLabel, marginTop: "16px" }}>Risk Factors</div>
              <p style={S.monographValue}>{overview.riskFactors}</p>
            </>
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
          {overview.keyGuidelines.map((guideline, index) => (
            <div
              key={`${guideline.name}-${index}`}
              style={{ padding: "10px 0", borderBottom: index < overview.keyGuidelines.length - 1 ? `1px solid ${S.card.borderColor}` : "none" }}
            >
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#34d399" }}>{guideline.name}</div>
              <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.6 }}>{guideline.detail}</div>
            </div>
          ))}
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
          {overview.landmarkTrials.map((trial, index) => (
            <div
              key={`${trial.name}-${index}`}
              style={{ padding: "10px 0", borderBottom: index < overview.landmarkTrials.length - 1 ? `1px solid ${S.card.borderColor}` : "none" }}
            >
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#fbbf24" }}>{trial.name}</div>
              <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.6 }}>{trial.detail}</div>
            </div>
          ))}
        </Section>

        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>Disease Subcategories</div>
        {selectedDisease.subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="pr-card"
            style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}
            onClick={() => navigateTo(NAV_STATES.SUBCATEGORY, { disease: selectedDisease, subcategory })}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 600 }}>{subcategory.name}</div>
              <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.5 }}>
                {subcategory.definition}
              </div>
            </div>
            <span style={{ color: S.monographLabel.color, fontSize: "20px", marginLeft: "12px" }}>›</span>
          </div>
        ))}

        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>
          Drug Monographs ({selectedDisease.drugMonographs.length})
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {selectedDisease.drugMonographs.map((drug) => (
            <div
              key={drug.id}
              className="pr-card"
              style={{ ...S.card, marginBottom: 0 }}
              onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: selectedDisease, monograph: drug })}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: theme === "dark" ? "#38bdf8" : "#0284c7" }}>{drug.name}</div>
              <div style={{ fontSize: "11px", color: S.monographValue.color, marginTop: "4px" }}>{drug.drugClass}</div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  if (navState === NAV_STATES.SUBCATEGORY && selectedDisease && selectedSubcategory) {
    const hasOrganisms = (selectedSubcategory.organismSpecific?.length ?? 0) > 0;

    return (
      <Layout compact>
        <button
          type="button"
          style={S.backBtn}
          onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}
        >
          ← {selectedDisease.name}
        </button>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>{selectedSubcategory.name}</h1>
        <div style={{ color: S.monographValue.color, fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
          {selectedSubcategory.definition}
        </div>
        <ExpandCollapseBar />

        {selectedSubcategory.clinicalPresentation && !selectedSubcategory.clinicalPresentation.startsWith("N/A") && (
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
            <p style={S.monographValue}>{selectedSubcategory.clinicalPresentation}</p>
          </Section>
        )}

        {selectedSubcategory.diagnostics && !selectedSubcategory.diagnostics.startsWith("N/A") && (
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
            <p style={S.monographValue}>{selectedSubcategory.diagnostics}</p>
          </Section>
        )}

        <Section
          id="empiric"
          title={
            selectedSubcategory.empiricTherapy?.some((tier) =>
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
          {selectedSubcategory.empiricTherapy?.map((tier, index) => (
            <EmpiricTierView
              key={`${tier.line}-${index}`}
              tier={tier}
              S={S}
              navigateTo={navigateTo}
              findMonograph={findMonograph}
              copiedId={copiedId}
              onCopy={handleCopy}
              allergies={allergies}
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
            {selectedSubcategory.organismSpecific?.map((organism, index) => (
              <div
                key={`${organism.organism}-${index}`}
                style={{ padding: "14px 0", borderBottom: index < (selectedSubcategory.organismSpecific?.length ?? 0) - 1 ? `1px solid ${S.card.borderColor}` : "none" }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#f59e0b", marginBottom: "8px" }}>{organism.organism}</div>
                <div style={{ display: "grid", gap: "6px" }}>
                  {organism.preferred && (
                    <div style={{ fontSize: "12px" }}>
                      <span style={{ color: S.monographLabel.color, fontWeight: 600 }}>Preferred: </span>
                      <span style={{ color: "#34d399" }}>{organism.preferred}</span>
                    </div>
                  )}
                  {organism.alternative && (
                    <div style={{ fontSize: "12px" }}>
                      <span style={{ color: S.monographLabel.color, fontWeight: 600 }}>Alternative: </span>
                      <span style={{ color: "#fbbf24" }}>{organism.alternative}</span>
                    </div>
                  )}
                  {organism.notes && <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>{organism.notes}</div>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {selectedSubcategory.pearls && selectedSubcategory.pearls.length > 0 && (
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
            {selectedSubcategory.pearls.map((pearl, index) => (
              <div key={`${index}-${pearl.slice(0, 20)}`} style={S.pearlBox}>
                💡 {pearl}
              </div>
            ))}
          </Section>
        )}
      </Layout>
    );
  }

  if (navState === NAV_STATES.MONOGRAPH && selectedDisease && selectedMonograph) {
    return (
      <Layout compact>
        <button
          type="button"
          style={S.backBtn}
          onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}
        >
          ← {selectedDisease.name}
        </button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: theme === "dark" ? "linear-gradient(135deg, #0ea5e920, #38bdf820)" : "linear-gradient(135deg, #bae6fd, #e0f2fe)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              flexShrink: 0,
            }}
          >
            💊
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>{selectedMonograph.name}</h1>
            <div style={{ fontSize: "13px", color: S.monographValue.color, marginTop: "4px" }}>{selectedMonograph.brandNames}</div>
            <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ ...S.tag, background: theme === "dark" ? "#0ea5e920" : "#0284c715", color: theme === "dark" ? "#38bdf8" : "#0284c7", border: `1px solid ${theme === "dark" ? "#0ea5e940" : "#0284c740"}` }}>
                {selectedMonograph.drugClass}
              </span>
            </div>
            <CrossRefBadges
              drugId={selectedMonograph.id}
              currentDiseaseId={selectedDisease.id}
              monographXref={MONOGRAPH_XREF}
              navigateTo={navigateTo}
              showToast={showToast}
              currentDrugName={selectedMonograph.name}
              S={S}
            />
            <AllergyWarning drugId={selectedMonograph.id} allergies={allergies} S={S} />
          </div>
        </div>
        <ExpandCollapseBar />

        <Section id="moa" title="Mechanism of Action" icon="⚙" accentColor="#38bdf8" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S} defaultOpen>
          <p style={S.monographValue}>{selectedMonograph.mechanismOfAction}</p>
        </Section>

        <Section id="spectrum" title="Spectrum of Activity" icon="🎯" accentColor="#34d399" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <p style={S.monographValue}>{selectedMonograph.spectrum}</p>
        </Section>

        <Section id="dosing" title="Dosing" icon="📐" accentColor="#a78bfa" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          {selectedMonograph.dosing &&
            Object.entries(selectedMonograph.dosing).map(([key, value]) => (
              <div
                key={key}
                style={{ padding: "8px 0", borderBottom: `1px solid ${S.card.borderColor}` }}
              >
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}: </span>
                <span style={{ fontSize: "13px", color: S.monographValue.color, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</span>
              </div>
            ))}
        </Section>

        <Section id="renal" title="Renal Dose Adjustment" icon="🫘" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <p style={S.monographValue}>{selectedMonograph.renalAdjustment}</p>
        </Section>

        <Section id="hepatic" title="Hepatic Dose Adjustment" icon="🫁" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <p style={S.monographValue}>{selectedMonograph.hepaticAdjustment}</p>
        </Section>

        <Section id="ae" title="Adverse Effects" icon="⚠" accentColor="#ef4444" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          {selectedMonograph.adverseEffects && (
            <div style={S.aeGrid}>
              <div style={aeCard("#fbbf24")}>
                <div style={aeLabel("#fbbf24")}>Common</div>
                <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{selectedMonograph.adverseEffects.common}</p>
              </div>
              <div style={aeCard("#ef4444")}>
                <div style={aeLabel("#ef4444")}>Serious</div>
                <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{selectedMonograph.adverseEffects.serious}</p>
              </div>
              {selectedMonograph.adverseEffects.rare && (
                <div style={aeCard("#64748b")}>
                  <div style={aeLabel("#94a3b8")}>Rare</div>
                  <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{selectedMonograph.adverseEffects.rare}</p>
                </div>
              )}
              {selectedMonograph.adverseEffects.fdaBoxedWarnings && (
                <div style={{ ...aeCard("#ef4444"), background: "#7f1d1d20", border: "2px solid #ef444480" }}>
                  <div style={aeLabel("#ef4444")}>FDA Boxed Warnings</div>
                  <p style={{ fontSize: "13px", color: "#fca5a5", lineHeight: 1.6, margin: 0 }}>{selectedMonograph.adverseEffects.fdaBoxedWarnings}</p>
                </div>
              )}
              {selectedMonograph.adverseEffects.contraindications && (
                <div style={aeCard("#ef4444")}>
                  <div style={aeLabel("#ef4444")}>Contraindications</div>
                  <p style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, margin: 0 }}>{selectedMonograph.adverseEffects.contraindications}</p>
                </div>
              )}
            </div>
          )}
        </Section>

        <Section id="interactions" title="Drug Interactions" icon="🔗" accentColor="#f59e0b" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          {selectedMonograph.drugInteractions?.map((interaction, index) => (
            <div key={`${index}-${interaction.slice(0, 20)}`} style={S.interactionItem}>
              {interaction}
            </div>
          ))}
        </Section>

        <Section id="monitoring" title="Monitoring Parameters" icon="📊" accentColor="#38bdf8" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <p style={S.monographValue}>{selectedMonograph.monitoring}</p>
        </Section>

        <Section id="pregnancy" title="Pregnancy & Lactation" icon="🤰" accentColor="#ec4899" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          <p style={S.monographValue}>{selectedMonograph.pregnancyLactation}</p>
        </Section>

        <Section id="pharm-pearls" title="Pharmacist Pearls" icon="💡" accentColor="#fbbf24" expandedSections={expandedSections} toggleSection={toggleSection} readingMode={readingMode} S={S}>
          {selectedMonograph.pharmacistPearls?.map((pearl, index) => (
            <div key={`${index}-${pearl.slice(0, 20)}`} style={S.pearlBox}>
              💡 {pearl}
            </div>
          ))}
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <p style={{ color: S.monographValue.color, textAlign: "center", padding: "60px 0" }}>Loading…</p>
    </Layout>
  );
}
