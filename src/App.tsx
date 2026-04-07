import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AllergyRecord, DiseaseState, ThemeKey } from "./types";
import { usePatientContext } from "./hooks/usePatientContext";
import { useBookmarks } from "./hooks/useBookmarks";
import { AuditView, CompareView, ExpandCollapseBar, Layout } from "./components";
import { useNavigation } from "./hooks/useNavigation";
import { useRecentViews } from "./hooks/useRecentViews";
import { useSearch } from "./hooks/useSearch";
import { NAV_STATES, applyThemeVars, makeStyles } from "./styles/constants";
import { clearPersistedState, usePersistedState } from "./utils/persistence";
import { WORK_SESSION_PERSISTENCE } from "./utils/persistenceEnvelope";
import { DISEASE_CATALOG, DISEASE_SUMMARY_BY_ID, MONOGRAPH_CATALOG, MONOGRAPH_SUMMARY_BY_ID } from "./data/catalog-manifest";
import { loadAllDiseases, loadDisease, loadRegimenCatalog } from "./data/catalog-loader";
import { buildCatalogDerived, type CatalogDerived } from "./data/derived";
import { PATHOGEN_REFERENCE_BY_ID, PATHOGEN_REFERENCES } from "./data/pathogen-references";
import { hasAnyPatientSignals } from "./utils/regimenGuidance";
import BreakpointWorkspacePage from "./pages/BreakpointWorkspacePage";
import DiseaseOverviewPage from "./pages/DiseaseOverviewPage";
import HomePage from "./pages/HomePage";
import MonographPage from "./pages/MonographPage";
import PathogenReferencePage from "./pages/PathogenReferencePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import CalculatorsPage from "./pages/CalculatorsPage";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [theme, setTheme] = usePersistedState<ThemeKey>("theme", "light");
  const [showPatientModal, setShowPatientModal] = useState(false);
  const { patient, setPatient, crcl, ibw, adjbw, isActive: patientActive } = usePatientContext();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [allergies, setAllergies] = usePersistedState<AllergyRecord[]>("allergies", [], WORK_SESSION_PERSISTENCE);
  const [readingMode, setReadingMode] = usePersistedState<boolean>("readingMode", false);
  const [toast, setToast] = useState<{ message: string; icon: string; leaving?: boolean } | null>(null);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergySeverity, setAllergySeverity] = useState("mild");
  const [compareItems, setCompareItems] = usePersistedState<string[]>("compareItems", []);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadedDiseases, setLoadedDiseases] = useState<Record<string, DiseaseState>>({});
  const [catalogDerived, setCatalogDerived] = useState<CatalogDerived | null>(null);
  const [catalogStatus, setCatalogStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const copiedTimerRef = useRef<number | null>(null);
  const loadedDiseasesRef = useRef<Record<string, DiseaseState>>({});
  const catalogDerivedRef = useRef<CatalogDerived | null>(null);
  const catalogPromiseRef = useRef<Promise<CatalogDerived> | null>(null);

  const {
    navState,
    navigateTo,
    selectedBreakpointPreset,
    selectedDiseaseId,
    selectedMonographId,
    selectedPathogenId,
    selectedSubcategoryId,
    updatePageTitle,
  } = useNavigation();
  const selectedDiseaseSummary = selectedDiseaseId ? DISEASE_SUMMARY_BY_ID[selectedDiseaseId] ?? null : null;
  const selectedDisease = selectedDiseaseId ? loadedDiseases[selectedDiseaseId] ?? null : null;
  const selectedPathogen = selectedPathogenId ? PATHOGEN_REFERENCE_BY_ID[selectedPathogenId] ?? null : null;
  const selectedSubcategory = useMemo(
    () => selectedDisease?.subcategories.find((subcategory) => subcategory.id === selectedSubcategoryId) ?? null,
    [selectedDisease, selectedSubcategoryId],
  );
  const selectedMonograph = useMemo(
    () => selectedDisease?.drugMonographs.find((monograph) => monograph.id === selectedMonographId) ?? null,
    [selectedDisease, selectedMonographId],
  );

  const ensureDiseaseLoaded = useCallback(async (diseaseId: string) => {
    const cached = loadedDiseasesRef.current[diseaseId];
    if (cached) return cached;

    const disease = await loadDisease(diseaseId);
    if (disease) {
      loadedDiseasesRef.current = { ...loadedDiseasesRef.current, [disease.id]: disease };
      setLoadedDiseases((current) => (current[disease.id] ? current : { ...current, [disease.id]: disease }));
    }
    return disease;
  }, []);

  const ensureCatalogDerived = useCallback(async () => {
    if (catalogDerivedRef.current) {
      return catalogDerivedRef.current;
    }

    if (catalogPromiseRef.current) {
      return catalogPromiseRef.current;
    }

    setCatalogStatus("loading");
    const promise = Promise.all([loadAllDiseases(), loadRegimenCatalog()])
      .then(([diseases, regimenCatalog]) => {
        const byId = Object.fromEntries(diseases.map((disease) => [disease.id, disease]));
        loadedDiseasesRef.current = { ...loadedDiseasesRef.current, ...byId };
        setLoadedDiseases((current) => ({ ...current, ...byId }));

        const nextDerived = buildCatalogDerived(diseases, regimenCatalog);
        catalogDerivedRef.current = nextDerived;
        setCatalogDerived(nextDerived);
        setCatalogStatus("ready");
        return nextDerived;
      })
      .catch((error) => {
        setCatalogStatus("error");
        throw error;
      })
      .finally(() => {
        catalogPromiseRef.current = null;
      });

    catalogPromiseRef.current = promise;
    return promise;
  }, []);

  const { deferredQuery, isSearchActive, searchResults } = useSearch(searchQuery, catalogDerived?.searchIndex ?? null);
  const { openRecent, recentViews } = useRecentViews(
    navState,
    selectedDisease,
    selectedSubcategory,
    selectedMonograph,
    selectedPathogen,
    navigateTo,
  );

  const S = useMemo(() => makeStyles(theme), [theme]);
  const hasWorkSessionData = allergies.length > 0 || hasAnyPatientSignals(patient);

  useEffect(() => {
    loadedDiseasesRef.current = loadedDiseases;
  }, [loadedDiseases]);

  useEffect(() => {
    catalogDerivedRef.current = catalogDerived;
  }, [catalogDerived]);

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
    setExpandedSections({});
  }, [navState, selectedDiseaseId, selectedSubcategoryId, selectedMonographId, selectedPathogenId]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setCommandPaletteOpen((open) => !open);
        return;
      }

      const activeTag = document.activeElement?.tagName;
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(activeTag ?? "")) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
        setSearchQuery("");
        return;
      }

      if (
        event.key === "Escape" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(activeTag ?? "") &&
        navState !== NAV_STATES.HOME &&
        !document.querySelector(".modal-overlay")
      ) {
        navigateTo(NAV_STATES.HOME);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [navState, navigateTo]);

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

  useEffect(() => {
    const routeNeedsDisease =
      navState === NAV_STATES.DISEASE_OVERVIEW ||
      navState === NAV_STATES.SUBCATEGORY ||
      navState === NAV_STATES.MONOGRAPH;

    if (!routeNeedsDisease || !selectedDiseaseId) return;

    let cancelled = false;
    void ensureDiseaseLoaded(selectedDiseaseId).then((disease) => {
      if (cancelled) return;

      if (!disease) {
        navigateTo(NAV_STATES.HOME);
        return;
      }

      if (navState === NAV_STATES.SUBCATEGORY && selectedSubcategoryId) {
        const exists = disease.subcategories.some((subcategory) => subcategory.id === selectedSubcategoryId);
        if (!exists) {
          navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: disease.id });
        }
      }

      if (navState === NAV_STATES.MONOGRAPH && selectedMonographId) {
        const exists = disease.drugMonographs.some((monograph) => monograph.id === selectedMonographId);
        if (!exists) {
          navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: disease.id });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ensureDiseaseLoaded, navState, navigateTo, selectedDiseaseId, selectedMonographId, selectedSubcategoryId]);

  useEffect(() => {
    if (selectedMonograph) updatePageTitle(selectedMonograph.name);
    else if (selectedSubcategory) updatePageTitle(selectedSubcategory.name);
    else if (selectedDisease) updatePageTitle(selectedDisease.name);
    else if (selectedPathogen) updatePageTitle(selectedPathogen.name);
    else if (isSearchActive) updatePageTitle(`Search: ${deferredQuery}`);
    else updatePageTitle();
  }, [deferredQuery, isSearchActive, selectedDisease, selectedMonograph, selectedPathogen, selectedSubcategory, updatePageTitle]);

  useEffect(() => {
    const shouldLoadFullCatalog =
      isSearchActive ||
      navState === NAV_STATES.COMPARE ||
      navState === NAV_STATES.DISEASE_OVERVIEW ||
      navState === NAV_STATES.SUBCATEGORY ||
      navState === NAV_STATES.MONOGRAPH ||
      navState === NAV_STATES.PATHOGEN ||
      navState === NAV_STATES.BREAKPOINTS ||
      navState === "audit";

    if (!shouldLoadFullCatalog) return;
    void ensureCatalogDerived();
  }, [ensureCatalogDerived, isSearchActive, navState]);

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

  const currentSectionIds = useMemo(() => {
    if (navState === NAV_STATES.DISEASE_OVERVIEW) return ["overview", "guidelines", "trials", "pathogens"];
    if (navState === NAV_STATES.SUBCATEGORY) {
      return [
        "presentation",
        "diagnostics",
        "workflow-diagnostics",
        "diagnostic-stewardship",
        "workflow-reassessment",
        "reassessment-timeline",
        "workflow-transition",
        "contamination-pitfalls",
        "duration-anchors",
        "microbiology",
        "pathogen-links",
        "empiric",
        "organism",
        "pearls",
      ];
    }
    if (navState === NAV_STATES.MONOGRAPH) {
      return [
        "moa",
        "spectrum",
        "dosing",
        "dosing-by-indication",
        "renal",
        "rrt",
        "hepatic",
        "special-pop",
        "ae",
        "interactions",
        "monitoring",
        "monitoring-actions",
        "tdm",
        "pregnancy",
        "administration",
        "administration-constraints",
        "microbiology",
        "pathogen-links",
        "misuse-traps",
        "penetration",
        "site-avoidances",
        "interaction-actions",
        "stewardship",
        "pharm-pearls",
        "opat-ipo",
      ];
    }
    if (navState === NAV_STATES.PATHOGEN) {
      return ["rapid-dx", "contamination", "mechanisms", "breakpoints", "therapy", "related"];
    }
    return [];
  }, [navState]);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((current) => ({ ...current, [id]: !current[id] }));
  }, []);

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

  const renderExpandCollapseBar = useCallback(
    () => <ExpandCollapseBar S={S} onExpand={expandAll} onCollapse={collapseAll} />,
    [S, collapseAll, expandAll],
  );

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

  const clearWorkData = useCallback(() => {
    if (!window.confirm("Clear all patient and allergy data from this session?")) return;
    clearPersistedState("patientContext", WORK_SESSION_PERSISTENCE);
    clearPersistedState("allergies", WORK_SESSION_PERSISTENCE);
    setPatient({});
    setAllergies([]);
    setAllergyInput("");
    setAllergySeverity("mild");
    showToast("Work session data cleared", "🧹");
  }, [setAllergies, setPatient, showToast]);

  const breadcrumbs = useMemo(() => {
    const trail: Array<{ label: string; action?: () => void }> = [{ label: "PharmRef", action: () => navigateTo(NAV_STATES.HOME) }];
    const diseaseLabel = selectedDisease?.name ?? selectedDiseaseSummary?.name ?? null;

    if (navState === NAV_STATES.COMPARE) {
      trail.push({ label: "Compare" });
      return trail;
    }

    if (navState === "audit") {
      trail.push({ label: "Audit" });
      return trail;
    }

    if (navState === NAV_STATES.CALCULATORS) {
      trail.push({ label: "Calculators" });
      return trail;
    }

    if (navState === NAV_STATES.BREAKPOINTS) {
      trail.push({ label: "Breakpoint workspace" });
      if (selectedPathogen) {
        trail.push({ label: selectedPathogen.name });
      }
      return trail;
    }

    if (navState === NAV_STATES.PATHOGEN && selectedPathogen) {
      trail.push({ label: "Pathogen references" });
      trail.push({ label: selectedPathogen.name });
      return trail;
    }

    if (diseaseLabel && navState !== NAV_STATES.HOME && selectedDiseaseId) {
      trail.push({
        label: diseaseLabel,
        action: () => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: selectedDiseaseId }),
      });
    }

    if (selectedSubcategory && navState === NAV_STATES.SUBCATEGORY) {
      trail.push({ label: selectedSubcategory.name });
    }

    if (navState === NAV_STATES.MONOGRAPH && selectedMonographId) {
      trail.push({ label: selectedMonograph?.name ?? MONOGRAPH_SUMMARY_BY_ID[selectedMonographId]?.name ?? "Monograph" });
    }

    return trail;
  }, [navState, navigateTo, selectedDisease, selectedDiseaseId, selectedDiseaseSummary, selectedMonograph, selectedMonographId, selectedPathogen, selectedSubcategory]);

  const compareDrugs = useMemo(
    () =>
      compareItems
        .map((drugId) => catalogDerived?.findMonograph(drugId) ?? null)
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [catalogDerived, compareItems],
  );

  const findMonograph = useCallback(
    (drugId: string) => {
      if (selectedDisease) {
        const local = selectedDisease.drugMonographs.find((monograph) => monograph.id === drugId);
        if (local) {
          return { disease: selectedDisease, monograph: local };
        }
      }
      return catalogDerived?.findMonograph(drugId) ?? null;
    },
    [catalogDerived, selectedDisease],
  );

  const auditDiseases = useMemo(() => {
    if (!catalogDerived) return [];
    return DISEASE_CATALOG.map((disease) => catalogDerived.diseaseById[disease.id]).filter(
      (disease): disease is DiseaseState => Boolean(disease),
    );
  }, [catalogDerived]);

  const handleHome = useCallback(() => {
    setSearchQuery("");
    navigateTo(NAV_STATES.HOME);
  }, [navigateTo]);

  const layoutProps = {
    S,
    allergies,
    allergyInput,
    allergySeverity,
    breadcrumbs,
    commandPaletteOpen,
    navigateTo,
    navState,
    onAddAllergy: addAllergy,
    onCloseAllergyModal: () => setShowAllergyModal(false),
    onCloseCommandPalette: () => setCommandPaletteOpen(false),
    onClearWorkData: clearWorkData,
    onHome: handleHome,
    onOpenAllergyModal: () => setShowAllergyModal(true),
    onOpenCommandPalette: () => setCommandPaletteOpen(true),
    onOpenPatientModal: () => setShowPatientModal(true),
    showPatientModal,
    onClosePatientModal: () => setShowPatientModal(false),
    patient,
    setPatient,
    patientActive,
    hasWorkSessionData,
    crcl,
    ibw,
    adjbw,
    onRemoveAllergy: removeAllergy,
    onSearchChange: setSearchQuery,
    onToggleReadingMode: () => setReadingMode((current) => !current),
    onToggleTheme: () => setTheme(theme === "light" ? "dark" : theme === "dark" ? "oled" : "light"),
    readingMode,
    searchQuery,
    searchRef,
    setAllergyInput,
    setAllergySeverity,
    showAllergyModal,
    showTopBtn,
    theme,
    toast,
  } as const;

  if (isSearchActive) {
    return (
      <Layout {...layoutProps}>
        {searchResults ? (
          <SearchResultsPage
            query={deferredQuery}
            results={searchResults}
            navigateTo={navigateTo}
            onClearSearch={() => setSearchQuery("")}
            S={S}
          />
        ) : (
          <div style={{ color: S.monographValue.color, textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            {catalogStatus === "error" ? "Search catalog unavailable." : <><span className="pr-spinner" />Loading search index…</>}
          </div>
        )}
      </Layout>
    );
  }

  if (navState === NAV_STATES.HOME) {
    return (
      <Layout {...layoutProps}>
        <HomePage
          allMonographs={MONOGRAPH_CATALOG}
          allergyCount={allergies.length}
          bookmarks={bookmarks}
          diseaseStates={DISEASE_CATALOG}
          findMonographSummary={(id) => MONOGRAPH_SUMMARY_BY_ID[id] ?? null}
          navigateTo={navigateTo}
          onOpenAllergyModal={() => setShowAllergyModal(true)}
          onOpenPatientModal={() => setShowPatientModal(true)}
          onOpenRecent={openRecent}
          onStartCompare={() => {
            setCompareItems([]);
            navigateTo(NAV_STATES.COMPARE);
          }}
          pathogens={PATHOGEN_REFERENCES}
          recentViews={recentViews}
          S={S}
          theme={theme}
          toggleBookmark={toggleBookmark}
          totalSubcategories={DISEASE_CATALOG.reduce((count, disease) => count + disease.subcategoryCount, 0)}
        />
      </Layout>
    );
  }

  if (navState === NAV_STATES.COMPARE) {
    return (
      <Layout {...layoutProps} compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        <CompareView
          drugs={compareDrugs}
          compareItems={compareItems}
          setCompareItems={setCompareItems}
          allMonographs={MONOGRAPH_CATALOG}
          adjbw={adjbw}
          crcl={crcl}
          ibw={ibw}
          patient={patient}
          regimenXref={catalogDerived?.regimenXref ?? {}}
          ExpandCollapseBar={renderExpandCollapseBar}
          S={S}
        />
      </Layout>
    );
  }

  if (navState === "audit") {
    return (
      <Layout {...layoutProps} compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        {catalogDerived ? (
          <AuditView diseaseStates={auditDiseases} S={S} />
        ) : (
          <div style={{ color: S.monographValue.color, textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            {catalogStatus === "error" ? "Catalog unavailable." : <><span className="pr-spinner" />Loading content audit…</>}
          </div>
        )}
      </Layout>
    );
  }

  if (navState === NAV_STATES.CALCULATORS) {
    return (
      <Layout {...layoutProps} compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        <CalculatorsPage S={S} theme={theme} patient={patient} crcl={crcl} ibw={ibw} adjbw={adjbw} showToast={showToast} />
      </Layout>
    );
  }

  if (navState === NAV_STATES.BREAKPOINTS) {
    return (
      <Layout {...layoutProps} compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        <BreakpointWorkspacePage
          crcl={crcl}
          diseaseStates={catalogDerived ? Object.values(catalogDerived.diseaseById) : []}
          findMonograph={findMonograph}
          navigateTo={navigateTo}
          patient={patient}
          pathogens={PATHOGEN_REFERENCES}
          selectedBreakpointPreset={selectedBreakpointPreset}
          selectedPathogenId={selectedPathogenId}
          S={S}
        />
      </Layout>
    );
  }

  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    return (
      <Layout {...layoutProps} compact>
        <DiseaseOverviewPage
          catalogDerived={catalogDerived}
          disease={selectedDisease}
          expandedSections={expandedSections}
          navigateTo={navigateTo}
          onCollapseAll={collapseAll}
          onExpandAll={expandAll}
          readingMode={readingMode}
          S={S}
          theme={theme}
          toggleSection={toggleSection}
        />
      </Layout>
    );
  }

  if (navState === NAV_STATES.SUBCATEGORY && selectedDisease && selectedSubcategory) {
    return (
      <Layout {...layoutProps} compact>
        <SubcategoryPage
          allergies={allergies}
          catalogDerived={catalogDerived}
          copiedId={copiedId}
          crcl={crcl}
          disease={selectedDisease}
          expandedSections={expandedSections}
          findMonograph={findMonograph}
          navigateTo={navigateTo}
          onCollapseAll={collapseAll}
          onCopy={handleCopy}
          onExpandAll={expandAll}
          patient={patient}
          readingMode={readingMode}
          S={S}
          showToast={showToast}
          subcategory={selectedSubcategory}
          toggleSection={toggleSection}
        />
      </Layout>
    );
  }

  if (navState === NAV_STATES.MONOGRAPH && selectedDisease && selectedMonograph) {
    return (
      <Layout {...layoutProps} compact>
        <MonographPage
          adjbw={adjbw}
          allergies={allergies}
          catalogDerived={catalogDerived}
          crcl={crcl}
          disease={selectedDisease}
          expandedSections={expandedSections}
          ibw={ibw}
          isBookmarked={isBookmarked}
          monograph={selectedMonograph}
          monographXref={catalogDerived?.monographXref ?? {}}
          regimenXref={catalogDerived?.regimenXref ?? {}}
          navigateTo={navigateTo}
          onCollapseAll={collapseAll}
          onExpandAll={expandAll}
          onOpenPatientModal={() => setShowPatientModal(true)}
          patient={patient}
          readingMode={readingMode}
          S={S}
          showToast={showToast}
          theme={theme}
          toggleBookmark={toggleBookmark}
          toggleSection={toggleSection}
        />
      </Layout>
    );
  }

  if (navState === NAV_STATES.PATHOGEN && selectedPathogen) {
    return (
      <Layout {...layoutProps} compact>
        <PathogenReferencePage
          catalogDerived={catalogDerived}
          expandedSections={expandedSections}
          navigateTo={navigateTo}
          onCollapseAll={collapseAll}
          onExpandAll={expandAll}
          pathogen={selectedPathogen}
          readingMode={readingMode}
          S={S}
          toggleSection={toggleSection}
        />
      </Layout>
    );
  }

  return (
    <Layout {...layoutProps}>
      <div style={{ color: S.monographValue.color, textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        <span className="pr-spinner" />
        {selectedDiseaseSummary ? `Loading ${selectedDiseaseSummary.name}…` : "Loading…"}
      </div>
    </Layout>
  );
}
