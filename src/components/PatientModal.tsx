import type { PatientContext, ThemeKey } from "../types";

interface PatientModalProps {
  show: boolean;
  onClose: () => void;
  theme: ThemeKey;
  patient: PatientContext;
  setPatient: (value: PatientContext | ((prev: PatientContext) => PatientContext)) => void;
  crcl: number | null;
  ibw: number | null;
  adjbw: number | null;
}

function crclColor(crcl: number | null): string {
  if (crcl === null) return "#94a3b8";
  if (crcl >= 60) return "#34d399";
  if (crcl >= 30) return "#fbbf24";
  return "#f87171";
}

function crclLabel(crcl: number | null): string {
  if (crcl === null) return "";
  if (crcl >= 60) return "Normal/Mild";
  if (crcl >= 30) return "Moderate impairment";
  if (crcl >= 15) return "Severe impairment";
  return "Kidney failure";
}

export default function PatientModal({
  show,
  onClose,
  theme,
  patient,
  setPatient,
  crcl,
  ibw,
  adjbw,
}: PatientModalProps) {
  if (!show) return null;

  const isDark = theme !== "light";
  const bg = isDark ? "rgba(8, 12, 22, 0.97)" : "rgba(255, 253, 249, 0.98)";
  const border = isDark ? "#263449" : "#d7dfd4";
  const inputBg = isDark ? "rgba(15, 23, 42, 0.84)" : "#fffefd";
  const textColor = isDark ? "#e5eef8" : "#172033";
  const mutedColor = isDark ? "#8ea1bb" : "#66758c";
  const headingColor = isDark ? "#f1f5f9" : "#0f172a";
  const accentColor = isDark ? "#7dd3fc" : "#0f766e";

  function field(key: keyof PatientContext, value: string) {
    const parsed = value === "" ? undefined : Number(value);
    setPatient((p) => ({ ...p, [key]: isNaN(parsed as number) ? undefined : parsed }));
  }

  function clear() {
    setPatient({});
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: inputBg,
    border: `1px solid ${border}`,
    borderRadius: "12px",
    color: textColor,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const selectStyle: React.CSSProperties = { ...inputStyle };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: mutedColor,
    marginBottom: "5px",
    display: "block",
  };

  const fieldWrap: React.CSSProperties = { display: "grid", gap: "4px" };

  const color = crclColor(crcl);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: isDark ? "rgba(2, 8, 23, 0.65)" : "rgba(15, 23, 42, 0.42)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(6px)", padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="modal-panel"
        style={{
          background: bg, border: `1px solid ${border}`, borderRadius: "24px",
          padding: "24px", maxWidth: "520px", width: "100%",
          boxShadow: isDark ? "0 28px 80px rgba(0,0,0,0.6)" : "0 28px 80px rgba(15,23,42,0.16)",
          maxHeight: "90vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: headingColor, margin: 0, letterSpacing: "-0.03em" }}>
              👤 Patient Context
            </h2>
            <p style={{ fontSize: "12px", color: mutedColor, margin: "4px 0 0", lineHeight: 1.5 }}>
              Set patient parameters for dynamic dosing context across monographs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: mutedColor, fontSize: "20px", cursor: "pointer", padding: "4px" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Age (years)</label>
            <input type="number" min="1" max="120" style={inputStyle} value={patient.age ?? ""} onChange={(e) => field("age", e.target.value)} placeholder="e.g. 65" />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Sex</label>
            <select style={selectStyle} value={patient.sex ?? ""} onChange={(e) => setPatient((p) => ({ ...p, sex: (e.target.value as "male" | "female") || undefined }))}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Weight (kg)</label>
            <input type="number" min="1" max="500" step="0.1" style={inputStyle} value={patient.weight ?? ""} onChange={(e) => field("weight", e.target.value)} placeholder="e.g. 70" />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Height (cm) <span style={{ fontWeight: 400 }}>— optional</span></label>
            <input type="number" min="60" max="250" style={inputStyle} value={patient.height ?? ""} onChange={(e) => field("height", e.target.value)} placeholder="e.g. 170" />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>SCr (mg/dL)</label>
            <input type="number" min="0.1" max="30" step="0.01" style={inputStyle} value={patient.scr ?? ""} onChange={(e) => field("scr", e.target.value)} placeholder="e.g. 1.2" />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Dialysis</label>
            <select style={selectStyle} value={patient.dialysis ?? "none"} onChange={(e) => setPatient((p) => ({ ...p, dialysis: e.target.value as PatientContext["dialysis"] }))}>
              <option value="none">None</option>
              <option value="HD">Hemodialysis (HD)</option>
              <option value="PD">Peritoneal Dialysis (PD)</option>
              <option value="CRRT">CRRT</option>
            </select>
          </div>
        </div>

        {patient.sex === "female" && (
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, marginBottom: "16px", cursor: "pointer" }}>
            <input type="checkbox" checked={patient.pregnant ?? false} onChange={(e) => setPatient((p) => ({ ...p, pregnant: e.target.checked }))} />
            Patient is pregnant
          </label>
        )}

        {/* Live results panel */}
        {(crcl !== null || ibw !== null) && (
          <div style={{ background: isDark ? "rgba(6,182,212,0.07)" : "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.28)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#06b6d4", marginBottom: "10px" }}>
              Derived Values
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
              {crcl !== null && (
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color, letterSpacing: "-0.04em" }}>{crcl}</div>
                  <div style={{ fontSize: "11px", color: mutedColor }}>CrCl mL/min</div>
                  <div style={{ fontSize: "11px", color, fontWeight: 700, marginTop: "2px" }}>{crclLabel(crcl)}</div>
                </div>
              )}
              {ibw !== null && (
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: accentColor, letterSpacing: "-0.04em" }}>{ibw}</div>
                  <div style={{ fontSize: "11px", color: mutedColor }}>IBW (kg)</div>
                </div>
              )}
              {adjbw !== null && (
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: accentColor, letterSpacing: "-0.04em" }}>{adjbw}</div>
                  <div style={{ fontSize: "11px", color: mutedColor }}>AdjBW (kg)</div>
                  <div style={{ fontSize: "11px", color: mutedColor, marginTop: "2px" }}>Use for obese dosing</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button
            type="button"
            onClick={clear}
            style={{ background: "none", border: `1px solid ${border}`, borderRadius: "12px", color: mutedColor, fontSize: "13px", padding: "10px 18px", cursor: "pointer", fontFamily: "inherit" }}
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: accentColor, border: "none", borderRadius: "12px", color: isDark ? "#082f49" : "#ecfeff", fontSize: "13px", fontWeight: 700, padding: "10px 22px", cursor: "pointer", fontFamily: "inherit" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
