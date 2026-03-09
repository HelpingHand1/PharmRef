import { useEffect } from "react";
import { AllergyModalProps } from "../types";

export default function AllergyModal({
  show,
  onClose,
  theme,
  allergies,
  allergyInput,
  setAllergyInput,
  allergySeverity,
  setAllergySeverity,
  addAllergy,
  removeAllergy,
}: AllergyModalProps) {
  useEffect(() => {
    if (!show) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, onClose]);

  if (!show) return null;
  const dark = theme === "dark";
  const bg = dark ? "rgba(15, 23, 42, 0.94)" : "rgba(255, 253, 249, 0.98)";
  const border = dark ? "#36506e" : "#d7dfd4";
  const inputBg = dark ? "rgba(15, 23, 42, 0.84)" : "#fffefd";
  const text = dark ? "#e5eef8" : "#172033";
  const heading = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#8ea1bb" : "#66758c";
  const accent = dark ? "#7dd3fc" : "#0f766e";

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: dark ? "rgba(2, 8, 23, 0.62)" : "rgba(15, 23, 42, 0.40)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="modal-panel"
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: "22px",
          padding: "24px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: dark ? "0 26px 70px rgba(2, 8, 23, 0.45)" : "0 24px 64px rgba(15, 23, 42, 0.14)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: dark ? "#7dd3fc18" : "#0f766e12",
              border: `1px solid ${dark ? "#7dd3fc30" : "#0f766e25"}`,
              fontSize: "18px",
            }}
          >
            ⚠
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: heading }}>Allergy & Interaction Profile</h3>
            <p style={{ fontSize: "12px", color: muted, margin: "4px 0 0" }}>Inline safety flags across monographs and therapy recommendations.</p>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: muted, marginBottom: "18px", lineHeight: 1.6 }}>
          Add allergies or medications for inline warnings. Flags appear on drug monographs and empiric therapy options.
        </p>

        <div className="allergy-form" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: "8px", marginBottom: "14px" }}>
          <input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addAllergy();
            }}
            placeholder="e.g. PCN, Warfarin, Sulfa…"
            style={{ minWidth: 0, padding: "12px 14px", background: inputBg, border: `1px solid ${border}`, borderRadius: "14px", color: text, fontSize: "14px", outline: "none" }}
          />
          <select
            value={allergySeverity}
            onChange={(e) => setAllergySeverity(e.target.value)}
            style={{ padding: "12px", background: inputBg, border: `1px solid ${border}`, borderRadius: "14px", color: text, fontSize: "12px" }}
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="anaphylaxis">Anaphylaxis</option>
          </select>
          <button
            onClick={addAllergy}
            style={{ padding: "12px 16px", background: accent, color: "#fff", border: "none", borderRadius: "14px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
          >
            Add
          </button>
        </div>

        {allergies.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {allergies.map((a) => (
              <span
                key={a.name}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "6px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700,
                  background: a.severity === "anaphylaxis" ? "#7f1d1d40" : dark ? "#92400e24" : "#fff7db",
                  color: a.severity === "anaphylaxis" ? "#f87171" : "#fbbf24",
                  border: `1px solid ${a.severity === "anaphylaxis" ? "#f8717140" : "#fbbf2440"}`,
                }}
              >
                {a.name} ({a.severity})
                <button onClick={() => removeAllergy(a.name)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, fontSize: "14px", lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          style={{ width: "100%", padding: "12px", background: "none", border: `1px solid ${border}`, borderRadius: "14px", color: muted, cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
