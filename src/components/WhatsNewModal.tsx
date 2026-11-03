import type { Styles } from "../types";
import { APP_VERSION } from "../version";
import { usePersistedState } from "../utils/persistence";
import { useFocusTrap } from "../utils/focusTrap";

interface WhatsNewProps {
  S: Styles;
}

const FEATURES = [
  {
    icon: "🩺",
    title: "Sepsis — SSC 2026",
    detail: "Antibiotics ideally within 1 hour for shock and for probable or definite sepsis, source control ideally within 6 hours, an initial MAP target of 60–65 mmHg at age 65+, and qSOFA no longer used alone for screening.",
  },
  {
    icon: "🫁",
    title: "Pneumonia — ATS 2025",
    detail: "Corticosteroids for severe CAP only (not non-severe CAP or influenza), and 3–5 day courses for non-severe CAP once clinically stable.",
  },
  {
    icon: "🧫",
    title: "Resistant Gram-Negatives — IDSA 2026",
    detail: "Aztreonam-avibactam for MBL producers, ceftolozane-tazobactam for DTR P. aeruginosa pneumonia, sulbactam-durlobactam for CRAB, cefiderocol for S. maltophilia, and ESBL presumption at a ceftriaxone MIC ≥4.",
  },
  {
    icon: "🫀",
    title: "Bacteremia & Endocarditis",
    detail: "Updated to the AHA 2026 endocarditis statement and IDSA/ESCMID 2026 S. aureus bacteremia guidance (TTE for all adults, TEE by risk features). Uncomplicated gram-negative bacteremia now defaults to 7 days.",
  },
  {
    icon: "💊",
    title: "New Agents",
    detail: "Added pivmecillinam, gepotidacin, sulopenem, oral tebipenem, cefepime-zidebactam, cefepime-enmetazobactam, aztreonam-avibactam, and rezafungin with label dosing.",
  },
  {
    icon: "⚠️",
    title: "Corrections",
    detail: "Sulbactam-durlobactam is now 1 g/1 g IV q6h, bezlotoxumab is marked discontinued, TMP-SMX for pyelonephritis is 7 days, and TMP-SMX is no longer called the drug of choice for S. maltophilia.",
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
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: S.meta.accent }}>
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
            This update brings clinical content in line with guidelines published through 2026 and corrects several dosing and factual errors.
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
