import type { Styles, ThemeKey } from "../types";
import { useFocusTrap } from "../utils/focusTrap";
import { APP_VERSION, CONTENT_REVIEWED_LABEL } from "../version";
import Icon, { type IconName } from "./Icon";

interface MoreSheetProps {
  hasWorkSessionData: boolean;
  onAudit: () => void;
  onBreakpoints: () => void;
  onClearWorkData: () => void;
  onClose: () => void;
  onCompare: () => void;
  onSetTheme: (theme: ThemeKey) => void;
  onToggleReadingMode: () => void;
  onWhatsNew: () => void;
  open: boolean;
  readingMode: boolean;
  S: Styles;
  theme: ThemeKey;
}

const THEME_OPTIONS: Array<{ key: ThemeKey; label: string; icon: IconName }> = [
  { key: "light", label: "Light", icon: "sun" },
  { key: "dark", label: "Dark", icon: "moon" },
  { key: "oled", label: "OLED", icon: "contrast" },
];

/** Everything that is not worth a permanent slot in the phone tab bar. */
export default function MoreSheet({
  hasWorkSessionData,
  onAudit,
  onBreakpoints,
  onClearWorkData,
  onClose,
  onCompare,
  onSetTheme,
  onToggleReadingMode,
  onWhatsNew,
  open,
  readingMode,
  S,
  theme,
}: MoreSheetProps) {
  const trapRef = useFocusTrap(open);
  if (!open) return null;

  const row = (icon: IconName, label: string, detail: string, onClick: () => void, tone?: string) => (
    <button
      type="button"
      className="sheet-row"
      style={{ color: tone ?? S.meta.textHeading, borderColor: S.meta.border }}
      onClick={() => {
        onClose();
        onClick();
      }}
    >
      <span className="sheet-row-icon" style={{ background: S.meta.accentSurface, color: tone ?? S.meta.accent }}>
        <Icon name={icon} size={20} />
      </span>
      <span style={{ display: "grid", gap: "2px", textAlign: "left", minWidth: 0 }}>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.4 }}>{detail}</span>
      </span>
      <span style={{ marginLeft: "auto", color: S.meta.textMuted }}>
        <Icon name="chevronRight" size={18} />
      </span>
    </button>
  );

  return (
    <div className="modal-overlay sheet-overlay" style={{ background: S.meta.overlay }} onClick={onClose}>
      <div
        ref={trapRef}
        className="sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-sheet-title"
        style={{ background: S.meta.sheetSurface, borderColor: S.meta.border, color: S.app.color }}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
          }
        }}
      >
        <div className="sheet-grabber" style={{ background: S.meta.border }} aria-hidden="true" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <h2 id="more-sheet-title" style={{ margin: 0, fontSize: "18px", fontWeight: 800, letterSpacing: "-0.03em", color: S.meta.textHeading }}>
            More
          </h2>
          <button type="button" className="sheet-close" aria-label="Close" style={{ color: S.meta.textMuted, borderColor: S.meta.border }} onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          {row("microbe", "Breakpoint workspace", "Turn a susceptibility result into therapy findings", onBreakpoints)}
          {row("compare", "Compare drugs", "Two monographs side by side", onCompare)}
          {hasWorkSessionData &&
            row("broom", "Clear session data", "Remove patient context and allergies from this device", onClearWorkData, "var(--pr-danger, #b91c1c)")}
        </div>

        <div style={{ ...S.monographLabel, margin: "18px 0 8px" }}>Display</div>
        <div className="sheet-segment" role="group" aria-label="Theme" style={{ borderColor: S.meta.border, background: S.meta.accentSurface }}>
          {THEME_OPTIONS.map((option) => {
            const selected = option.key === theme;
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={selected}
                style={{
                  background: selected ? S.meta.sheetSurface : "transparent",
                  color: selected ? S.meta.accent : S.meta.textMuted,
                  boxShadow: selected ? S.meta.shadowSm : "none",
                }}
                onClick={() => onSetTheme(option.key)}
              >
                <Icon name={option.icon} size={16} />
                {option.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="sheet-toggle"
          role="switch"
          aria-checked={readingMode}
          style={{ color: S.meta.textHeading, borderColor: S.meta.border }}
          onClick={onToggleReadingMode}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon name="reading" size={18} style={{ color: S.meta.accent }} />
            <span style={{ display: "grid", gap: "2px", textAlign: "left" }}>
              <span style={{ fontSize: "14px", fontWeight: 700 }}>Reading view</span>
              <span style={{ fontSize: "12px", color: S.meta.textMuted }}>All sections open in a narrow column</span>
            </span>
          </span>
          <span className={readingMode ? "sheet-switch is-on" : "sheet-switch"} style={{ background: readingMode ? S.meta.accent : S.meta.border }} aria-hidden="true">
            <span />
          </span>
        </button>

        <div style={{ ...S.monographLabel, margin: "18px 0 8px" }}>About</div>
        <div style={{ display: "grid", gap: "8px" }}>
          {row("sparkle", "What's new", `Changes in version ${APP_VERSION}`, onWhatsNew)}
          {row("audit", "Content audit", "Completeness and cross-reference checks", onAudit)}
        </div>
        <p style={{ margin: "16px 0 0", fontSize: "12px", lineHeight: 1.55, color: S.meta.textMuted, textAlign: "center" }}>
          PharmRef v{APP_VERSION} · Catalog reviewed {CONTENT_REVIEWED_LABEL}
          <br />
          Verify clinical decisions against current guidelines.
        </p>
      </div>
    </div>
  );
}
