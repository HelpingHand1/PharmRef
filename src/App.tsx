import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AllergyRecord } from "./types";
import { DISEASE_STATES } from "./data";
import { usePatientContext } from "./hooks/usePatientContext";
import { useBookmarks } from "./hooks/useBookmarks";
import {
  ALL_MONOGRAPHS,
  MONOGRAPH_XREF,
  TOTAL_SUBCATEGORIES,
  findMonograph,
} from "./data/derived";
import { AuditView, CompareView, ExpandCollapseBar, Layout } from "./components";
import { useNavigation } from "./hooks/useNavigation";
import { useRecentViews } from "./hooks/useRecentViews";
import { useSearch } from "./hooks/useSearch";
import { NAV_STATES, applyThemeVars, makeStyles } from "./styles/constants";
import { usePersistedState } from "./utils/persistence";
import DiseaseOverviewPage from "./pages/DiseaseOverviewPage";
import HomePage from "./pages/HomePage";
import MonographPage from "./pages/MonographPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import type { ThemeKey } from "./types";


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

  const { navState, navigateTo, selectedDisease, selectedMonograph, selectedSubcategory } = useNavigation();
  const { deferredQuery, searchResults } = useSearch(searchQuery);
  const { openRecent, recentViews } = useRecentViews(
    navState,
    selectedDisease,
    selectedSubcategory,
    selectedMonograph,
    navigateTo,
  );

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
    setExpandedSections({});
  }, [navState, selectedDisease?.id, selectedSubcategory?.id, selectedMonograph?.id]);

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

  const currentSectionIds = useMemo(() => {
    if (navState === NAV_STATES.DISEASE_OVERVIEW) return ["overview", "guidelines", "trials"];
    if (navState === NAV_STATES.SUBCATEGORY) return ["presentation", "diagnostics", "empiric", "organism", "pearls"];
    if (navState === NAV_STATES.MONOGRAPH) {
      return ["moa", "spectrum", "dosing", "renal", "hepatic", "ae", "interactions", "monitoring", "pregnancy", "pharm-pearls"];
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

    if (navState === NAV_STATES.CALCULATORS) {
      trail.push({ label: "Calculators" });
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
    () => compareItems.map((drugId) => findMonograph(drugId)).filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [compareItems],
  );

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
    navState,
    onAddAllergy: addAllergy,
    onCloseAllergyModal: () => setShowAllergyModal(false),
    onHome: handleHome,
    onOpenAllergyModal: () => setShowAllergyModal(true),
    onOpenPatientModal: () => setShowPatientModal(true),
    showPatientModal,
    onClosePatientModal: () => setShowPatientModal(false),
    patient,
    setPatient,
    patientActive,
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

  if (searchResults) {
    return (
      <Layout {...layoutProps}>
        <SearchResultsPage
          query={deferredQuery}
          results={searchResults}
          navigateTo={navigateTo}
          onClearSearch={() => setSearchQuery("")}
          S={S}
        />
      </Layout>
    );
  }

  if (navState === NAV_STATES.HOME) {
    return (
      <Layout {...layoutProps}>
        <HomePage
          allMonographs={ALL_MONOGRAPHS}
          allergyCount={allergies.length}
          bookmarks={bookmarks}
          diseaseStates={DISEASE_STATES}
          findMonograph={findMonograph}
          isBookmarked={isBookmarked}
          navigateTo={navigateTo}
          onOpenAllergyModal={() => setShowAllergyModal(true)}
          onOpenPatientModal={() => setShowPatientModal(true)}
          onOpenRecent={openRecent}
          onStartCompare={() => {
            setCompareItems([]);
            navigateTo(NAV_STATES.COMPARE);
          }}
          recentViews={recentViews}
          S={S}
          theme={theme}
          toggleBookmark={toggleBookmark}
          totalSubcategories={TOTAL_SUBCATEGORIES}
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
          allMonographs={ALL_MONOGRAPHS}
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
        <AuditView diseaseStates={DISEASE_STATES} findMonograph={findMonograph} S={S} />
      </Layout>
    );
  }

  if (navState === NAV_STATES.CALCULATORS) {
    return (
      <Layout {...layoutProps} compact>
        <button type="button" style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>
          ← Home
        </button>
        <CalculatorsPage S={S} theme={theme} patient={patient} crcl={crcl} ibw={ibw} adjbw={adjbw} />
      </Layout>
    );
  }

  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    return (
      <Layout {...layoutProps} compact>
        <DiseaseOverviewPage
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
          copiedId={copiedId}
          disease={selectedDisease}
          expandedSections={expandedSections}
          findMonograph={findMonograph}
          navigateTo={navigateTo}
          onCollapseAll={collapseAll}
          onCopy={handleCopy}
          onExpandAll={expandAll}
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
          crcl={crcl}
          disease={selectedDisease}
          expandedSections={expandedSections}
          ibw={ibw}
          isBookmarked={isBookmarked}
          monograph={selectedMonograph}
          monographXref={MONOGRAPH_XREF}
          navigateTo={navigateTo}
          onCollapseAll={collapseAll}
          onExpandAll={expandAll}
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

  return (
    <Layout {...layoutProps}>
      <p style={{ color: S.monographValue.color, textAlign: "center", padding: "60px 0" }}>Loading…</p>
    </Layout>
  );
}
