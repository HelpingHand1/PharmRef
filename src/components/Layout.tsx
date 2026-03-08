import type { ReactNode, RefObject } from "react";
import type { AllergyRecord, NavStateKey, Styles } from "../types";
import AllergyModal from "./AllergyModal";
import DisclaimerModal from "./DisclaimerModal";
import Toast from "./Toast";

type Breadcrumb = {
  label: string;
  action?: () => void;
};

interface LayoutProps {
  S: Styles;
  allergies: AllergyRecord[];
  allergyInput: string;
  allergySeverity: string;
  breadcrumbs: Breadcrumb[];
  children: ReactNode;
  compact?: boolean;
  navState: NavStateKey;
  onAddAllergy: () => void;
  onCloseAllergyModal: () => void;
  onHome: () => void;
  onRemoveAllergy: (name: string) => void;
  onSearchChange: (value: string) => void;
  onToggleReadingMode: () => void;
  onToggleTheme: () => void;
  readingMode: boolean;
  searchQuery: string;
  searchRef: RefObject<HTMLInputElement | null>;
  setAllergyInput: (value: string) => void;
  setAllergySeverity: (value: string) => void;
  showAllergyModal: boolean;
  showTopBtn: boolean;
  theme: "dark" | "light";
  toast: { message: string; icon: string; leaving?: boolean } | null;
}

export default function Layout({
  S,
  allergies,
  allergyInput,
  allergySeverity,
  breadcrumbs,
  children,
  compact = false,
  navState,
  onAddAllergy,
  onCloseAllergyModal,
  onHome,
  onRemoveAllergy,
  onSearchChange,
  onToggleReadingMode,
  onToggleTheme,
  readingMode,
  searchQuery,
  searchRef,
  setAllergyInput,
  setAllergySeverity,
  showAllergyModal,
  showTopBtn,
  theme,
  toast,
}: LayoutProps) {
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
          <div style={S.searchWrap} className="search-wrap">
            <span style={S.searchIcon}>⌕</span>
            <input
              ref={searchRef}
              className="search-input"
              style={{ ...S.searchBox, ...(compact ? { maxWidth: "320px" } : {}) }}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search drugs, organisms, syndromes, pearls..."
            />
            {searchQuery ? (
              <button type="button" style={S.clearBtn} onClick={() => onSearchChange("")} title="Clear search">
                ✕
              </button>
            ) : (
              <span style={S.kbdHint}>/</span>
            )}
          </div>
          <div style={S.headerToolbar} className="header-toolbar">
            <button type="button" style={S.expandAllBtn} onClick={onToggleReadingMode} title="Toggle reading mode">
              {readingMode ? "Standard View" : "Reading View"}
            </button>
            <button type="button" style={S.themeToggle} onClick={onToggleTheme} title="Toggle theme">
              {theme === "dark" ? "Light" : "Dark"}
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
        onClose={onCloseAllergyModal}
        theme={theme}
        allergies={allergies}
        allergyInput={allergyInput}
        setAllergyInput={setAllergyInput}
        allergySeverity={allergySeverity}
        setAllergySeverity={setAllergySeverity}
        addAllergy={onAddAllergy}
        removeAllergy={onRemoveAllergy}
      />
      <DisclaimerModal S={S} />
    </div>
  );
}
