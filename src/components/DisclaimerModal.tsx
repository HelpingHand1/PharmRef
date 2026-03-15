import { DisclaimerModalProps } from "../types";
import { usePersistedState } from "../utils/persistence";

export default function DisclaimerModal({ S }: DisclaimerModalProps) {
  const [dismissed, setDismissed] = usePersistedState("disclaimerDismissed", false);

  if (dismissed) return null;

  return (
    <div className="modal-overlay" style={{
      position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.56)", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      <div className="modal-panel modal-panel-sm" role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title" style={{
        background: S.card?.background || "#1e293b",
        border: `1px solid ${S.card?.borderColor || "#334155"}`,
        borderRadius: "22px",
        maxWidth: "460px",
        padding: "28px",
        textAlign: "center",
        boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
      }}>
        <div style={{ fontSize: "30px", marginBottom: "14px" }}>⚠️</div>
        <h2 id="disclaimer-modal-title" style={{ color: "#fbbf24", fontSize: "20px", marginBottom: "12px", letterSpacing: "-0.03em" }}>
          Clinical Disclaimer
        </h2>
        <p style={{ color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.7, marginBottom: "22px", fontSize: "14px" }}>
          PharmRef is a personal study and practice tool only.<br />
          Always verify against primary sources, your institution’s antibiogram,<br />
          and the latest IDSA guidelines. Not a substitute for clinical judgment.
        </p>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: S.meta?.accent || "#0ea5e9",
            color: "#fff",
            padding: "13px 28px",
            borderRadius: "14px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          I Understand — Don’t Show Again
        </button>
      </div>
    </div>
  );
}
