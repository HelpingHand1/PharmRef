import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import type { AllergyRecord, NavigateTo, NavStateKey, PatientContext, Styles, ThemeKey } from "../types";
import AllergyModal from "./AllergyModal";
import BottomNav from "./BottomNav";
import CommandPalette from "./CommandPalette";
import DisclaimerModal from "./DisclaimerModal";
import Icon from "./Icon";
import MoreSheet from "./MoreSheet";
import PatientModal from "./PatientModal";
import SectionRail from "./SectionRail";
import Toast from "./Toast";
import UpdateBanner from "./UpdateBanner";
import WhatsNewModal from "./WhatsNewModal";
import { NAV_STATES } from "../styles/constants";
import { buildPathogenBreakpointPreset } from "../utils/breakpointWorkspacePreset";
import { usePersistedState } from "../utils/persistence";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";
import { PATHOGEN_REFERENCES } from "../data/pathogen-references";
import { APP_VERSION, CONTENT_REVIEWED_LABEL } from "../version";

type Breadcrumb = {
  label: string;
  action?: () => void;
};

interface LayoutProps {
  S: Styles;
  adjbw: number | null;
  allergies: AllergyRecord[];
  allergyInput: string;
  allergySeverity: string;
  breadcrumbs: Breadcrumb[];
  children: ReactNode;
  commandPaletteOpen: boolean;
  compact?: boolean;
  crcl: number | null;
  hasWorkSessionData: boolean;
  ibw: number | null;
  moreOpen: boolean;
  navigateTo: NavigateTo;
  navState: NavStateKey;
  onAddAllergy: () => void;
  onCloseAllergyModal: () => void;
  onCloseCommandPalette: () => void;
  onCloseMore: () => void;
  onClosePatientModal: () => void;
  onClearWorkData: () => void;
  onHome: () => void;
  onOpenAllergyModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenMore: () => void;
  onOpenPatientModal: () => void;
  onOpenSection: (id: string) => void;
  onRemoveAllergy: (name: string) => void;
  onSearchChange: (value: string) => void;
  onSetTheme: (theme: ThemeKey) => void;
  onStartCompare: () => void;
  onToggleReadingMode: () => void;
  onToggleTheme: () => void;
  patient: PatientContext;
  patientActive: boolean;
  readingMode: boolean;
  routeKey: string;
  searchActive: boolean;
  searchQuery: string;
  searchRef: RefObject<HTMLInputElement | null>;
  setAllergyInput: (value: string) => void;
  setAllergySeverity: (value: string) => void;
  setPatient: (value: PatientContext | ((prev: PatientContext) => PatientContext)) => void;
  showAllergyModal: boolean;
  showPatientModal: boolean;
  showTopBtn: boolean;
  theme: ThemeKey;
  toast: { message: string; icon: string; leaving?: boolean } | null;
}

export default function Layout({
  S,
  adjbw,
  allergies,
  allergyInput,
  allergySeverity,
  breadcrumbs,
  children,
  commandPaletteOpen,
  compact = false,
  crcl,
  hasWorkSessionData,
  ibw,
  moreOpen,
  navigateTo,
  navState,
  onAddAllergy,
  onCloseAllergyModal,
  onCloseCommandPalette,
  onCloseMore,
  onClosePatientModal,
  onClearWorkData,
  onHome,
  onOpenAllergyModal,
  onOpenCommandPalette,
  onOpenMore,
  onOpenPatientModal,
  onOpenSection,
  onRemoveAllergy,
  onSearchChange,
  onSetTheme,
  onStartCompare,
  onToggleReadingMode,
  onToggleTheme,
  patient,
  patientActive,
  readingMode,
  routeKey,
  searchActive,
  searchQuery,
  searchRef,
  setAllergyInput,
  setAllergySeverity,
  setPatient,
  showAllergyModal,
  showPatientModal,
  showTopBtn,
  theme,
  toast,
}: LayoutProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [, setWhatsNewDismissed] = usePersistedState(`whatsNew_${APP_VERSION}`, false);
  const allergyCount = allergies.length;
  const crclColor = crcl === null ? "#8ea1bb" : crcl >= 60 ? "#34d399" : crcl >= 30 ? "#fbbf24" : "#f87171";
  const patientSignalsActive = patientActive || hasAnyPatientSignals(patient);
  const themeIcon = theme === "light" ? "moon" : theme === "oled" ? "sun" : "contrast";
  const themeTitle = theme === "light" ? "Switch to dark mode" : theme === "oled" ? "Switch to light mode" : "Switch to OLED mode";
  const toolButton = { ...S.themeToggle, width: "40px", height: "40px", padding: 0 } as const;

  // Sections scroll to just below the sticky header, whatever height it currently is.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const publish = () => {
      document.documentElement.style.setProperty("--pr-header-h", `${Math.round(header.getBoundingClientRect().height)}px`);
    };
    publish();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(publish);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const openBreakpoints = () =>
    navigateTo(NAV_STATES.BREAKPOINTS, {
      pathogenId: PATHOGEN_REFERENCES[0]?.id ?? null,
      breakpointPreset: buildPathogenBreakpointPreset(PATHOGEN_REFERENCES[0]),
    });

  return (
    <div style={S.app} className={readingMode ? "reading-mode app-shell" : "app-shell"}>
      <a className="skip-link" href="#main-content" onClick={(event) => {
        // The hash is the router, so move focus by hand instead of following the link.
        event.preventDefault();
        document.getElementById("main-content")?.focus();
      }}>
        Skip to content
      </a>
      <header ref={headerRef} style={S.header} className={showTopBtn ? "app-header is-scrolled" : "app-header"}>
        <div style={S.headerTop} className="header-row">
          <button type="button" className="logo-btn" style={{ ...S.logo, background: "none", border: "none", fontFamily: "inherit" }} onClick={onHome} aria-label="PharmRef home">
            <span className="logo-mark" aria-hidden="true">⚕</span>
            <span className="logo-text">PharmRef</span>
            <span className="logo-pill" style={S.logoPill}>Rx</span>
          </button>
          <div style={{ ...S.searchWrap, ...(compact ? { maxWidth: "320px" } : {}) }} className="search-wrap" role="search">
            <span style={S.searchIcon}><Icon name="search" size={17} /></span>
            <input
              ref={searchRef}
              className="search-input"
              style={S.searchBox}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="Search PharmRef"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                // On a phone, "Search" on the keyboard should get the keyboard out of the way.
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              placeholder="Search drugs, pathways, pathogens…"
            />
            {searchQuery ? (
              <button type="button" style={S.clearBtn} onClick={() => onSearchChange("")} title="Clear search" aria-label="Clear search">
                <Icon name="close" size={14} style={{ margin: "0 auto" }} />
              </button>
            ) : (
              <span style={S.kbdHint} className="kbd-hint">/</span>
            )}
          </div>
          <div style={S.headerToolbar} className="header-toolbar">
            <button
              type="button"
              className="cmdk-btn"
              style={{ ...S.themeToggle, gap: "4px", height: "40px", paddingLeft: "10px", paddingRight: "10px", fontSize: "12px" }}
              onClick={onOpenCommandPalette}
              title="Command palette (⌘K)"
              aria-label="Open command palette"
            >
              <Icon name="command" size={15} />
              <span style={{ fontWeight: 700 }}>K</span>
            </button>
            <button
              type="button"
              style={{ ...toolButton, width: "auto", minWidth: "40px", gap: "6px", padding: allergyCount > 0 ? "0 10px" : 0 }}
              onClick={onOpenAllergyModal}
              title={allergyCount > 0 ? `${allergyCount} allergy flag${allergyCount === 1 ? "" : "s"} active` : "Manage allergy profile"}
              aria-label={allergyCount > 0 ? `${allergyCount} allergy flag${allergyCount === 1 ? "" : "s"} active` : "Manage allergy profile"}
            >
              <Icon name="allergy" size={18} />
              {allergyCount > 0 && (
                <span style={{ background: "#b91c1c", color: "#fff", borderRadius: "9999px", fontSize: "11px", fontWeight: 800, padding: "1px 6px", lineHeight: 1.4, minWidth: "16px", textAlign: "center" }}>
                  {allergyCount}
                </span>
              )}
            </button>
            <button
              type="button"
              style={{ ...toolButton, width: "auto", minWidth: "40px", gap: "6px", padding: patientSignalsActive ? "0 10px" : 0 }}
              onClick={onOpenPatientModal}
              title={patientSignalsActive ? (crcl !== null ? `Patient active · CrCl: ${crcl} mL/min` : "Patient context active") : "Set patient context"}
              aria-label={patientSignalsActive ? (crcl !== null ? `Patient active, CrCl ${crcl} mL per min` : "Patient context active") : "Set patient context"}
            >
              <Icon name="patient" size={18} />
              {patientSignalsActive && (
                <span
                  style={{
                    background: crcl !== null ? crclColor : "#38bdf8",
                    color: "#000",
                    borderRadius: "9999px",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "1px 6px",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {crcl !== null ? <>{crcl}<span className="badge-unit"> mL/min</span></> : "Active"}
                </span>
              )}
            </button>
            {hasWorkSessionData && (
              <button type="button" style={toolButton} onClick={onClearWorkData} title="Clear work session data" aria-label="Clear work session data">
                <Icon name="broom" size={18} />
              </button>
            )}
            <button
              type="button"
              style={{ ...toolButton, ...(readingMode ? { color: S.meta.accent, border: `1px solid ${S.meta.accent}` } : {}) }}
              onClick={onToggleReadingMode}
              title={readingMode ? "Switch to standard view" : "Switch to reading view"}
              aria-label={readingMode ? "Switch to standard view" : "Switch to reading view"}
              aria-pressed={readingMode}
            >
              <Icon name="reading" size={18} />
            </button>
            <button type="button" style={toolButton} onClick={onToggleTheme} title={themeTitle} aria-label={themeTitle}>
              <Icon name={themeIcon} size={18} />
            </button>
          </div>
        </div>
        {navState !== "home" && !searchActive && (
          <nav style={S.breadcrumbs} className="breadcrumbs-row" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {index > 0 && <span aria-hidden="true">›</span>}
                {crumb.action ? (
                  <button type="button" style={S.breadcrumbLink} onClick={crumb.action}>
                    {crumb.label}
                  </button>
                ) : (
                  <span style={{ color: S.monographValue.color }} aria-current="page">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {!readingMode && <SectionRail routeKey={routeKey} onOpenSection={onOpenSection} S={S} />}
      </header>
      <UpdateBanner S={S} />
      <main id="main-content" tabIndex={-1} style={S.main} className="app-main">{children}</main>
      <footer
        className="no-print app-footer"
        style={{
          borderTop: `1px solid ${S.meta.border}`,
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "12px",
          color: S.meta.textMuted,
          letterSpacing: "0.02em",
          lineHeight: 1.6,
        }}
      >
        PharmRef v{APP_VERSION} &middot; Catalog reviewed {CONTENT_REVIEWED_LABEL} &middot; For educational use only &mdash; verify all clinical decisions against current guidelines
      </footer>
      {showTopBtn && (
        <button
          type="button"
          className="top-btn no-print"
          style={S.topBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
          aria-label="Back to top"
        >
          <Icon name="arrowUp" size={20} />
        </button>
      )}
      <BottomNav
        active={searchActive ? null : navState === NAV_STATES.HOME ? "home" : navState === NAV_STATES.CALCULATORS ? "calculators" : null}
        allergyCount={allergyCount}
        crcl={crcl}
        moreOpen={moreOpen}
        onAllergies={onOpenAllergyModal}
        onCalculators={() => {
          onSearchChange("");
          navigateTo(NAV_STATES.CALCULATORS);
        }}
        onHome={onHome}
        onMore={moreOpen ? onCloseMore : onOpenMore}
        onPatient={onOpenPatientModal}
        patientActive={patientSignalsActive}
        S={S}
      />
      <MoreSheet
        hasWorkSessionData={hasWorkSessionData}
        onAudit={() => {
          onSearchChange("");
          navigateTo("audit");
        }}
        onBreakpoints={() => {
          onSearchChange("");
          openBreakpoints();
        }}
        onClearWorkData={onClearWorkData}
        onClose={onCloseMore}
        onCompare={() => {
          onSearchChange("");
          onStartCompare();
        }}
        onSetTheme={onSetTheme}
        onToggleReadingMode={onToggleReadingMode}
        onWhatsNew={() => setWhatsNewDismissed(false)}
        open={moreOpen}
        readingMode={readingMode}
        S={S}
        theme={theme}
      />
      <Toast toast={toast} S={S} />
      <AllergyModal
        show={showAllergyModal}
        onClose={onCloseAllergyModal}
        theme={theme}
        allergies={allergies}
        allergyInput={allergyInput}
        setAllergyInput={setAllergyInput}
        allergySeverity={allergySeverity}
        setAllergySeverity={setAllergySeverity}
        addAllergy={onAddAllergy}
        onClearWorkData={onClearWorkData}
        removeAllergy={onRemoveAllergy}
      />
      <PatientModal
        show={showPatientModal}
        onClose={onClosePatientModal}
        theme={theme}
        patient={patient}
        setPatient={setPatient}
        crcl={crcl}
        ibw={ibw}
        adjbw={adjbw}
        onClearWorkData={onClearWorkData}
      />
      <DisclaimerModal S={S} />
      <WhatsNewModal S={S} />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={onCloseCommandPalette}
        navigateTo={navigateTo}
        S={S}
        onClearSearch={() => onSearchChange("")}
        onOpenAllergyModal={onOpenAllergyModal}
        onOpenPatientModal={onOpenPatientModal}
      />
    </div>
  );
}
