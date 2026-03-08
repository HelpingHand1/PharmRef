import React from "react";
import { DisclaimerModalProps } from "../types";
import { usePersistedState } from "../utils/persistence";

export default function DisclaimerModal({ S }: DisclaimerModalProps) {
  const [dismissed, setDismissed] = usePersistedState("disclaimerDismissed", false);

  if (dismissed) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000cc", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        background: S.card?.background || "#1e293b",
        border: `1px solid ${S.card?.borderColor || "#334155"}`,
        borderRadius: "12px",
        maxWidth: "420px",
        padding: "24px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>⚠️</div>
        <h2 style={{ color: "#fbbf24", fontSize: "18px", marginBottom: "12px" }}>
          Clinical Disclaimer
        </h2>
        <p style={{ color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.6, marginBottom: "20px" }}>
          PharmRef is a personal study and practice tool only.<br />
          Always verify against primary sources, your institution’s antibiogram,<br />
          and the latest IDSA guidelines. Not a substitute for clinical judgment.
        </p>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "#0ea5e9",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "8px",
            fontWeight: 600,
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