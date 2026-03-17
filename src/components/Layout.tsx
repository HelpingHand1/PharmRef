import type { ReactNode, RefObject } from "react";
import type { AllergyRecord, NavStateKey, PatientContext, Styles, ThemeKey } from "../types";
import AllergyModal from "./AllergyModal";
import DisclaimerModal from "./DisclaimerModal";
import PatientModal from "./PatientModal";
import Toast from "./Toast";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";
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
  compact?: boolean;
  crcl: number | null;
  hasWorkSessionData: boolean;
  ibw: number | null;
  navState: NavStateKey;
  onAddAllergy: () => void;
  onCloseAllergyModal: () => void;
  onClosePatientModal: () => void;
  onClearWorkData: () => void;
  onHome: () => void;
  onOpenAllergyModal: () => void;
  onOpenPatientModal: () => void;
  onRemoveAllergy: (name: string) => void;
  onSearchChange: (value: string) => void;
  onToggleReadingMode: () => void;
  onToggleTheme: () => void;
  patient: PatientContext;
  patientActive: boolean;
  readingMode: boolean;
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
  compact = false,
  crcl,
  hasWorkSessionData,
  ibw,
  navState,
  onAddAllergy,
  onCloseAllergyModal,
  onClosePatientModal,
  onClearWorkData,
  onHome,
  onOpenAllergyModal,
  onOpenPatientModal,
  onRemoveAllergy,
  onSearchChange,
  onToggleReadingMode,
  onToggleTheme,
  patient,
  patientActive,
  readingMode,
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
  const allergyCount = allergies.length;
  const crclColor = crcl === null ? "#8ea1bb" : crcl >= 60 ? "#34d399" : crcl >= 30 ? "#fbbf24" : "#f87171";
  const patientSignalsActive = patientActive || hasAnyPatientSignals(patient);
  const themeIcon = theme === "light" ? "🌙" : theme === "oled" ? "⬛" : "☀";
  const themeTitle = theme === "light" ? "Switch to dark mode" : theme === "oled" ? "Switch to light mode" : "Switch to OLED mode";
  return (
    <div style={S.app} className={readingMode ? "reading-mode app-shell" : "app-shell"}>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <header style={S.header} className="app-header">
        <div style={S.headerTop} className="header-row">
          <button type="button" style={{ ...S.logo, background: "none", border: "none", fontFamily: "inherit" }} onClick={onHome}>
            <span>⚕</span> PharmRef <span style={S.logoPill}>Rx</span>
          </button>
          <div style={{ ...S.searchWrap, ...(compact ? { maxWidth: "320px" } : {}) }} className="search-wrap">
            <span style={S.searchIcon}>⌕</span>
            <input
              ref={searchRef}
              className="search-input"
              style={S.searchBox}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search drugs, organisms, syndromes, pearls..."
            />
            {searchQuery ? (
              <button type="button" style={S.clearBtn} onClick={() => onSearchChange("")} title="Clear search" aria-label="Clear search">
                ✕
              </button>
            ) : (
              <span style={S.kbdHint}>/</span>
            )}
          </div>
          <div style={S.headerToolbar} className="header-toolbar">
            <button
              type="button"
              style={{ ...S.themeToggle, position: "relative", gap: "6px", paddingLeft: "10px", paddingRight: "10px" }}
              onClick={onOpenAllergyModal}
              title={allergyCount > 0 ? `${allergyCount} allergy flag${allergyCount === 1 ? "" : "s"} active` : "Manage allergy profile"}
              aria-label={allergyCount > 0 ? `${allergyCount} allergy flag${allergyCount === 1 ? "" : "s"} active` : "Manage allergy profile"}
            >
              ⚠
              {allergyCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: "9999px", fontSize: "10px", fontWeight: 800, padding: "1px 5px", lineHeight: 1.4, minWidth: "16px", textAlign: "center" }}>
                  {allergyCount}
                </span>
              )}
            </button>
            <button
              type="button"
              style={{ ...S.themeToggle, position: "relative", gap: "6px", paddingLeft: "10px", paddingRight: "10px" }}
              onClick={onOpenPatientModal}
              title={patientSignalsActive ? (crcl !== null ? `Patient active · CrCl: ${crcl} mL/min` : "Patient context active") : "Set patient context"}
              aria-label={patientSignalsActive ? (crcl !== null ? `Patient active, CrCl ${crcl} mL per min` : "Patient context active") : "Set patient context"}
            >
              👤
              {patientSignalsActive && (
                <span
                  style={{
                    background: crcl !== null ? crclColor : "#38bdf8",
                    color: "#000",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "1px 6px",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {crcl !== null ? `${crcl} mL/min` : "Active"}
                </span>
              )}
            </button>
            {hasWorkSessionData && (
              <button
                type="button"
                style={{ ...S.themeToggle, gap: "6px", paddingLeft: "10px", paddingRight: "10px" }}
                onClick={onClearWorkData}
                title="Clear work session data"
                aria-label="Clear work session data"
              >
                🧹
              </button>
            )}
            <button type="button" style={S.themeToggle} onClick={onToggleReadingMode} title={readingMode ? "Switch to standard view" : "Switch to reading view"} aria-label={readingMode ? "Switch to standard view" : "Switch to reading view"}>
              {readingMode ? "≡" : "📖"}
            </button>
            <button type="button" style={S.themeToggle} onClick={onToggleTheme} title={themeTitle} aria-label={themeTitle}>
              {themeIcon}
            </button>
          </div>
        </div>
        {navState !== "home" && (
          <div style={S.breadcrumbs} className="breadcrumbs-row">
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
      <main style={S.main} className="app-main">{children}</main>
      <footer
        className="no-print"
        style={{
          borderTop: `1px solid ${S.meta.border}`,
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "11px",
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
          className="top-btn"
          style={S.topBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
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
    </div>
  );
}
