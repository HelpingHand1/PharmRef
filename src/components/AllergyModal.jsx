import React from "react";

export default function AllergyModal({
  show, onClose, theme,
  allergies, allergyInput, setAllergyInput,
  allergySeverity, setAllergySeverity,
  addAllergy, removeAllergy,
}) {
  if (!show) return null;
  const dark = theme === "dark";
  const bg = dark ? "#1e293b" : "#fff";
  const border = dark ? "#334155" : "#e2e8f0";
  const inputBg = dark ? "#0f172a" : "#f1f5f9";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const heading = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onClose}
    >
      <div
        style={{ background: bg, border: `1px solid ${border}`, borderRadius: "12px", padding: "24px", maxWidth: "400px", width: "100%" }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: heading }}>⚠ Allergy & Interaction Profile</h3>
        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px", lineHeight: 1.5 }}>
          Add allergies or medications for inline warnings. Flags appear on drug monographs and empiric therapy options.
        </p>

        <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
          <input
            value={allergyInput}
            onChange={e => setAllergyInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addAllergy(); }}
            placeholder="e.g. PCN, Warfarin, Sulfa…"
            style={{ flex: 1, padding: "8px 12px", background: inputBg, border: `1px solid ${border}`, borderRadius: "6px", color: text, fontSize: "13px", outline: "none" }}
          />
          <select
            value={allergySeverity}
            onChange={e => setAllergySeverity(e.target.value)}
            style={{ padding: "8px", background: inputBg, border: `1px solid ${border}`, borderRadius: "6px", color: text, fontSize: "12px" }}
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="anaphylaxis">Anaphylaxis</option>
          </select>
          <button
            onClick={addAllergy}
            style={{ padding: "8px 14px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
          >
            Add
          </button>
        </div>

        {allergies.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {allergies.map(a => (
              <span
                key={a.name}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600,
                  background: a.severity === "anaphylaxis" ? "#7f1d1d40" : "#92400e20",
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
          style={{ width: "100%", padding: "8px", background: "none", border: `1px solid ${border}`, borderRadius: "6px", color: muted, cursor: "pointer", fontSize: "12px" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}