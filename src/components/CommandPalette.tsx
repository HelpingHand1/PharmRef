import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DISEASE_CATALOG, MONOGRAPH_CATALOG } from "../data/catalog-manifest";
import { PATHOGEN_REFERENCES } from "../data/pathogen-references";
import { NAV_STATES } from "../styles/constants";
import type { NavigateTo, Styles } from "../types";
import { useFocusTrap } from "../utils/focusTrap";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  navigateTo: NavigateTo;
  S: Styles;
  onClearSearch: () => void;
  onOpenAllergyModal: () => void;
  onOpenPatientModal: () => void;
}

interface PaletteItem {
  id: string;
  label: string;
  detail: string;
  icon: string;
  category: string;
  action: () => void;
  keywords: string;
}

function buildItems(
  navigateTo: NavigateTo,
  onClose: () => void,
  onOpenAllergyModal: () => void,
  onOpenPatientModal: () => void,
): PaletteItem[] {
  const items: PaletteItem[] = [];

  items.push(
    {
      id: "action-compare",
      label: "Compare Drugs",
      detail: "Side-by-side monograph comparison",
      icon: "⚖",
      category: "Quick Actions",
      action: () => navigateTo(NAV_STATES.COMPARE),
      keywords: "compare side by side",
    },
    {
      id: "action-calculators",
      label: "Clinical Calculators",
      detail: "CrCl, IBW, CURB-65, PSI, Vanco AUC, Aminoglycosides",
      icon: "🧮",
      category: "Quick Actions",
      action: () => navigateTo(NAV_STATES.CALCULATORS),
      keywords: "calculator crcl ibw curb psi vancomycin auc aminoglycoside",
    },
    {
      id: "action-breakpoints",
      label: "Breakpoint Workspace",
      detail: "Susceptibility and MIC interpretation",
      icon: "🧬",
      category: "Quick Actions",
      action: () => navigateTo(NAV_STATES.BREAKPOINTS),
      keywords: "breakpoint mic susceptibility workspace",
    },
    {
      id: "action-audit",
      label: "Content Audit",
      detail: "Check content completeness and integrity",
      icon: "🔍",
      category: "Quick Actions",
      action: () => navigateTo("audit" as any),
      keywords: "audit integrity completeness",
    },
    {
      id: "action-allergy",
      label: "Allergy Profile",
      detail: "Manage allergy and interaction flags",
      icon: "⚠",
      category: "Quick Actions",
      action: () => { onClose(); onOpenAllergyModal(); },
      keywords: "allergy interaction warning",
    },
    {
      id: "action-patient",
      label: "Patient Context",
      detail: "Set patient parameters for dosing guidance",
      icon: "👤",
      category: "Quick Actions",
      action: () => { onClose(); onOpenPatientModal(); },
      keywords: "patient context weight age renal crcl",
    },
  );

  for (const disease of DISEASE_CATALOG) {
    if (disease.subcategoryCount === 0) continue;
    items.push({
      id: `disease-${disease.id}`,
      label: disease.name,
      detail: `${disease.subcategoryCount} pathways · ${disease.monographCount} monographs`,
      icon: disease.icon,
      category: "Clinical Topics",
      action: () => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: disease.id }),
      keywords: `${disease.name} ${disease.category}`.toLowerCase(),
    });
  }

  for (const monograph of MONOGRAPH_CATALOG) {
    items.push({
      id: `monograph-${monograph.parentDiseaseId}-${monograph.id}`,
      label: monograph.name,
      detail: `${monograph.drugClass} · ${monograph.parentDiseaseName}`,
      icon: "💊",
      category: "Drug Monographs",
      action: () =>
        navigateTo(NAV_STATES.MONOGRAPH, {
          diseaseId: monograph.parentDiseaseId,
          monographId: monograph.id,
        }),
      keywords: `${monograph.name} ${monograph.drugClass} ${monograph.parentDiseaseName}`.toLowerCase(),
    });
  }

  for (const pathogen of PATHOGEN_REFERENCES) {
    items.push({
      id: `pathogen-${pathogen.id}`,
      label: pathogen.name,
      detail: pathogen.phenotype,
      icon: "🦠",
      category: "Pathogens",
      action: () => navigateTo(NAV_STATES.PATHOGEN, { pathogenId: pathogen.id }),
      keywords: `${pathogen.name} ${pathogen.phenotype} ${pathogen.likelySyndromes.join(" ")}`.toLowerCase(),
    });
  }

  return items;
}

export default function CommandPalette({
  open,
  onClose,
  navigateTo,
  S,
  onClearSearch,
  onOpenAllergyModal,
  onOpenPatientModal,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(open);

  const items = useMemo(
    () => buildItems(navigateTo, onClose, onOpenAllergyModal, onOpenPatientModal),
    [navigateTo, onClose, onOpenAllergyModal, onOpenPatientModal],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 20);
    const q = query.toLowerCase().trim();
    const scored = items
      .map((item) => {
        const label = item.label.toLowerCase();
        const kw = item.keywords;
        let score = 0;
        if (label === q) score = 100;
        else if (label.startsWith(q)) score = 80;
        else if (label.includes(q)) score = 60;
        else if (kw.includes(q)) score = 40;
        else return null;
        return { item, score };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    scored.sort((a, b) => b.score - a.score);
    return scored.map((entry) => entry.item).slice(0, 20);
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (item: PaletteItem) => {
      onClearSearch();
      onClose();
      item.action();
    },
    [onClose, onClearSearch],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[selectedIndex];
        if (item) handleSelect(item);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filtered, handleSelect, onClose, selectedIndex],
  );

  if (!open) return null;

  const isDark = S.app.background !== "#f8faf7";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: isDark ? "rgba(2, 8, 23, 0.60)" : "rgba(15, 23, 42, 0.38)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "min(12vh, 120px) 20px 20px",
      }}
      onClick={onClose}
    >
      <div
        ref={trapRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          background: S.card.background,
          border: `1px solid ${S.card.borderColor}`,
          borderRadius: "20px",
          maxWidth: "560px",
          width: "100%",
          boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.55)" : "0 32px 80px rgba(15,23,42,0.18)",
          overflow: "hidden",
          animation: "palette-in 0.15s ease-out",
        }}
      >
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${S.card.borderColor}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: S.meta.accent, fontSize: "16px" }}>⌘</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Jump to topic, drug, pathogen, or action..."
              aria-label="Command palette search"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: S.meta.textHeading,
                fontSize: "16px",
                fontFamily: "inherit",
                padding: 0,
              }}
            />
            <kbd
              style={{
                fontSize: "10px",
                fontFamily: "inherit",
                padding: "2px 6px",
                borderRadius: "5px",
                border: `1px solid ${S.card.borderColor}`,
                color: S.meta.textMuted,
                background: S.app.background,
              }}
            >
              ESC
            </kbd>
          </div>
        </div>
        <div
          ref={listRef}
          role="listbox"
          aria-label="Command palette results"
          style={{ maxHeight: "380px", overflowY: "auto", padding: "6px 0" }}
        >
          {filtered.length === 0 && (
            <div style={{ padding: "24px 20px", textAlign: "center", color: S.meta.textMuted, fontSize: "13px" }}>
              No matches found
            </div>
          )}
          {filtered.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  background: isSelected ? S.meta.accentSurface : "transparent",
                  transition: "background 0.08s",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    background: isSelected ? `${S.meta.accent}18` : S.meta.accentSurface,
                    border: `1px solid ${isSelected ? S.meta.accent + "30" : S.card.borderColor}`,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isSelected ? S.meta.accent : S.meta.textHeading,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: S.meta.textMuted,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "1px",
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: S.meta.textMuted,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            borderTop: `1px solid ${S.card.borderColor}`,
            padding: "8px 20px",
            display: "flex",
            gap: "16px",
            fontSize: "11px",
            color: S.meta.textMuted,
          }}
        >
          <span><kbd style={{ fontFamily: "inherit", fontWeight: 700 }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ fontFamily: "inherit", fontWeight: 700 }}>↵</kbd> open</span>
          <span><kbd style={{ fontFamily: "inherit", fontWeight: 700 }}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
