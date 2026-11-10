import type { ReactNode } from "react";
import type { Styles } from "../types";
import Icon, { type IconName } from "./Icon";

interface BottomNavProps {
  active: "home" | "calculators" | null;
  allergyCount: number;
  crcl: number | null;
  moreOpen: boolean;
  onAllergies: () => void;
  onCalculators: () => void;
  onHome: () => void;
  onMore: () => void;
  onPatient: () => void;
  patientActive: boolean;
  S: Styles;
}

// Badge fills carry white text, so they stay dark in every theme.
const BADGE_GREEN = "#047857";
const BADGE_AMBER = "#b45309";
const BADGE_RED = "#b91c1c";
const BADGE_TEAL = "#0f766e";

function crclTone(crcl: number): string {
  if (crcl >= 60) return BADGE_GREEN;
  if (crcl >= 30) return BADGE_AMBER;
  return BADGE_RED;
}

/** Thumb-reach navigation for phones. Hidden on wider screens, where the header toolbar does this job. */
export default function BottomNav({
  active,
  allergyCount,
  crcl,
  moreOpen,
  onAllergies,
  onCalculators,
  onHome,
  onMore,
  onPatient,
  patientActive,
  S,
}: BottomNavProps) {
  const item = (
    key: string,
    icon: IconName,
    label: string,
    onClick: () => void,
    options: { current?: boolean; ariaLabel?: string; badge?: ReactNode; expanded?: boolean } = {},
  ) => (
    <button
      key={key}
      type="button"
      className={options.current ? "bottom-nav-item is-current" : "bottom-nav-item"}
      aria-label={options.ariaLabel ?? label}
      aria-current={options.current && options.expanded === undefined ? "page" : undefined}
      aria-expanded={options.expanded}
      style={{ color: options.current ? S.meta.accent : S.meta.textMuted }}
      onClick={onClick}
    >
      <span className="bottom-nav-icon">
        <Icon name={icon} size={22} strokeWidth={options.current ? 2.1 : 1.8} />
        {options.badge}
      </span>
      <span className="bottom-nav-label">{label}</span>
    </button>
  );

  return (
    <nav
      className="bottom-nav no-print"
      aria-label="Primary"
      style={{ background: S.meta.navSurface, borderTop: `1px solid ${S.meta.border}` }}
    >
      {item("home", "home", "Home", onHome, { current: active === "home" })}
      {item("calculators", "calculator", "Calcs", onCalculators, { current: active === "calculators", ariaLabel: "Calculators" })}
      {item("patient", "patient", "Patient", onPatient, {
        ariaLabel: patientActive
          ? crcl !== null ? `Patient context active, CrCl ${crcl} mL per min` : "Patient context active"
          : "Set patient context",
        badge: patientActive ? (
          <span className="bottom-nav-badge" style={{ background: crcl !== null ? crclTone(crcl) : BADGE_TEAL }}>
            {crcl !== null ? crcl : "•"}
          </span>
        ) : null,
      })}
      {item("allergies", "allergy", "Allergies", onAllergies, {
        ariaLabel: allergyCount > 0 ? `${allergyCount} allergy flag${allergyCount === 1 ? "" : "s"} active` : "Manage allergy profile",
        badge: allergyCount > 0 ? (
          <span className="bottom-nav-badge" style={{ background: BADGE_RED }}>{allergyCount}</span>
        ) : null,
      })}
      {item("more", "more", "More", onMore, { current: moreOpen, expanded: moreOpen })}
    </nav>
  );
}
