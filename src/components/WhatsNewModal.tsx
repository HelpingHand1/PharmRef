import type { Styles } from "../types";
import { APP_VERSION } from "../version";
import { usePersistedState } from "../utils/persistence";
import { useFocusTrap } from "../utils/focusTrap";

interface WhatsNewProps {
  S: Styles;
}

const FEATURES = [
  {
    icon: "⚠️",
    title: "Vancomycin Estimator Fixed",
    detail: "The estimator treated CrCl as mL/min/kg and suggested about 4.5 g/day for nearly every patient. It now gives a per-dose regimen aimed at AUC ≈ 500, with warnings for CrCl <30, weight ≥120 kg, and MIC ≥2.",
  },
  {
    icon: "🩹",
    title: "PEN-FAST",
    detail: "Penicillin allergy risk score with direct oral challenge guidance. A severe cutaneous reaction history is always flagged for allergy referral.",
  },
  {
    icon: "📅",
    title: "Antibiotic Course",
    detail: "Enter day 1 and a duration to see today's day of therapy and the final day, then copy the summary for your note.",
  },
  {
    icon: "🔎",
    title: "Typo-Tolerant Search",
    detail: "Misspellings like “zosin” or “cefipime” now offer a “Did you mean” suggestion instead of an empty page.",
  },
  {
    icon: "🩺",
    title: "Guideline Updates (2.5.0)",
    detail: "SSC 2026 sepsis, ATS 2025 CAP, IDSA 2026 resistant gram-negatives, AHA/IDSA 2026 bacteremia and endocarditis, new agents, and several dosing corrections.",
  },
];

export default function WhatsNewModal({ S }: WhatsNewProps) {
  const storageKey = `whatsNew_${APP_VERSION}`;
  const [dismissed, setDismissed] = usePersistedState(storageKey, false);
  const [disclaimerDismissed] = usePersistedState("disclaimerDismissed", false);
  const trapRef = useFocusTrap(!dismissed && disclaimerDismissed);

  if (dismissed || !disclaimerDismissed) return null;

  const isDark = S.app.background !== "#f8faf7";

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 490,
        background: isDark ? "rgba(2, 8, 23, 0.58)" : "rgba(15, 23, 42, 0.36)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={() => setDismissed(true)}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: S.card.background,
          border: `1px solid ${S.card.borderColor}`,
          borderRadius: "22px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: isDark ? "0 28px 70px rgba(0,0,0,0.5)" : "0 28px 70px rgba(15,23,42,0.16)",
          maxHeight: "85vh",
          overflowY: "auto",
          animation: "palette-in 0.2s ease-out",
        }}
      >
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: S.meta.accentSurface,
                border: `1px solid ${S.meta.accent}30`,
                fontSize: "14px",
                color: S.meta.accent,
                fontWeight: 800,
              }}
            >
              ✦
            </span>
            <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: S.meta.accent }}>
              What's New
            </span>
          </div>
          <h2
            id="whats-new-title"
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: S.meta.textHeading,
              margin: "8px 0 6px",
            }}
          >
            PharmRef {APP_VERSION}
          </h2>
          <p style={{ fontSize: "13px", color: S.meta.textMuted, margin: "0 0 20px", lineHeight: 1.6 }}>
            This update fixes the vancomycin estimator and adds new bedside tools.
          </p>
        </div>

        <div style={{ padding: "0 28px 20px" }}>
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              style={{
                display: "flex",
                gap: "14px",
                padding: "14px 0",
                borderTop: `1px solid ${S.card.borderColor}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "17px",
                  background: S.meta.accentSurface,
                  border: `1px solid ${S.card.borderColor}`,
                  flexShrink: 0,
                }}
              >
                {feature.icon}
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, marginBottom: "3px" }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>
                  {feature.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 28px 24px" }}>
          <button
            onClick={() => setDismissed(true)}
            style={{
              width: "100%",
              background: S.meta.accent,
              color: "#fff",
              padding: "13px",
              borderRadius: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
