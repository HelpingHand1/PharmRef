import { useEffect } from "react";
import type { PatientContext, ThemeKey } from "../types";
import {
  parseActiveMedicationsInput,
  serializeActiveMedicationsInput,
} from "../utils/patientMedicationInteractions";

interface PatientModalProps {
  show: boolean;
  onClose: () => void;
  onClearWorkData: () => void;
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
  onClearWorkData,
  theme,
  patient,
  setPatient,
  crcl,
  ibw,
  adjbw,
}: PatientModalProps) {
  useEffect(() => {
    if (!show) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, onClose]);

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

  function textField(key: keyof PatientContext, value: string) {
    setPatient((p) => ({ ...p, [key]: value || undefined }));
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
      className="modal-overlay"
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-modal-title"
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
            <h2 id="patient-modal-title" style={{ fontSize: "20px", fontWeight: 800, color: headingColor, margin: 0, letterSpacing: "-0.03em" }}>
              👤 Patient Context
            </h2>
            <p style={{ fontSize: "12px", color: mutedColor, margin: "4px 0 0", lineHeight: 1.5 }}>
              Set patient parameters for dynamic dosing, stewardship, and medication-interaction context across monographs.
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
        <div
          style={{
            marginBottom: "18px",
            padding: "10px 12px",
            borderRadius: "14px",
            border: `1px solid ${isDark ? "#7dd3fc30" : "#0f766e22"}`,
            background: isDark ? "#7dd3fc12" : "#0f766e0d",
            color: mutedColor,
            fontSize: "12px",
            lineHeight: 1.55,
          }}
        >
          Stored only in this browser session and automatically cleared after 12 hours.
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

        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "16px",
            border: `1px solid ${isDark ? "#36506e" : "#cbd5df"}`,
            background: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(248, 250, 247, 0.92)",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: accentColor, marginBottom: "10px" }}>
            Bedside Execution Flags
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>PO route</label>
              <select
                style={selectStyle}
                value={patient.oralRoute ?? ""}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    oralRoute: (e.target.value as PatientContext["oralRoute"]) || undefined,
                  }))
                }
              >
                <option value="">Not assessed</option>
                <option value="adequate">Adequate for PO step-down</option>
                <option value="limited">Limited or unreliable</option>
                <option value="none">Unavailable</option>
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>OPAT logistics</label>
              <select
                style={selectStyle}
                value={patient.opatSupport ?? ""}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    opatSupport: (e.target.value as PatientContext["opatSupport"]) || undefined,
                  }))
                }
              >
                <option value="">Not assessed</option>
                <option value="adequate">Home infusion and follow-up ready</option>
                <option value="uncertain">Some logistics still unclear</option>
                <option value="limited">Not a reliable OPAT setup</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.enteralFeeds ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, enteralFeeds: e.target.checked }))}
              />
              Continuous enteral feeds or major cation exposure
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.qtRisk ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, qtRisk: e.target.checked }))}
              />
              Baseline QT risk or prolonged QTc
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.serotonergicMeds ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, serotonergicMeds: e.target.checked }))}
              />
              Active serotonergic medications
            </label>
          </div>
        </div>

        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "16px",
            border: `1px solid ${isDark ? "#2f4556" : "#c6d4d8"}`,
            background: isDark ? "rgba(12, 31, 41, 0.64)" : "rgba(240, 249, 255, 0.76)",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: isDark ? "#67e8f9" : "#0f766e", marginBottom: "10px" }}>
            Host Risk and Timeline
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.immunocompromised ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, immunocompromised: e.target.checked }))}
              />
              Immunocompromised host
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.neutropenic ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, neutropenic: e.target.checked }))}
              />
              Neutropenic
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.transplant ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, transplant: e.target.checked }))}
              />
              Transplant recipient
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.icuLevelCare ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, icuLevelCare: e.target.checked }))}
              />
              ICU-level care
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.vasopressors ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, vasopressors: e.target.checked }))}
              />
              Vasopressors active
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Cultures collected</label>
              <input
                type="date"
                style={inputStyle}
                value={patient.cultureCollectedOn ?? ""}
                onChange={(e) => textField("cultureCollectedOn", e.target.value)}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Rapid diagnostic resulted</label>
              <input
                type="date"
                style={inputStyle}
                value={patient.rapidDiagnosticOn ?? ""}
                onChange={(e) => textField("rapidDiagnosticOn", e.target.value)}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Final culture resulted</label>
              <input
                type="date"
                style={inputStyle}
                value={patient.finalCultureOn ?? ""}
                onChange={(e) => textField("finalCultureOn", e.target.value)}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Source control achieved</label>
              <input
                type="date"
                style={inputStyle}
                value={patient.sourceControlOn ?? ""}
                onChange={(e) => textField("sourceControlOn", e.target.value)}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Operative source control</label>
              <input
                type="date"
                style={inputStyle}
                value={patient.operativeSourceControlOn ?? ""}
                onChange={(e) => textField("operativeSourceControlOn", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "16px",
            border: `1px solid ${isDark ? "#4c3b2b" : "#ddd6c7"}`,
            background: isDark ? "rgba(41, 28, 17, 0.42)" : "rgba(255, 247, 237, 0.76)",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: isDark ? "#fbbf24" : "#b45309", marginBottom: "10px" }}>
            Stewardship Risk Flags
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>MRSA nares</label>
              <select
                style={selectStyle}
                value={patient.mrsaNares ?? ""}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    mrsaNares: (e.target.value as PatientContext["mrsaNares"]) || undefined,
                  }))
                }
              >
                <option value="">Not assessed</option>
                <option value="pending">Pending</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Culture status</label>
              <select
                style={selectStyle}
                value={patient.cultureStatus ?? ""}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    cultureStatus: (e.target.value as PatientContext["cultureStatus"]) || undefined,
                  }))
                }
              >
                <option value="">Not assessed</option>
                <option value="not_sent">Not sent</option>
                <option value="pending">Pending</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Rapid diagnostic</label>
              <select
                style={selectStyle}
                value={patient.rapidDiagnosticResult ?? ""}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    rapidDiagnosticResult: (e.target.value as PatientContext["rapidDiagnosticResult"]) || undefined,
                  }))
                }
              >
                <option value="">Not assessed</option>
                <option value="none">No actionable signal</option>
                <option value="mrsa">MRSA</option>
                <option value="mssa">MSSA</option>
                <option value="esbl">ESBL</option>
                <option value="kpc">KPC</option>
                <option value="mbl">MBL</option>
                <option value="dtr-pseudomonas">DTR Pseudomonas</option>
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Source control</label>
              <select
                style={selectStyle}
                value={patient.sourceControl ?? ""}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    sourceControl: (e.target.value as PatientContext["sourceControl"]) || undefined,
                  }))
                }
              >
                <option value="">Not assessed</option>
                <option value="achieved">Achieved</option>
                <option value="pending">Pending</option>
                <option value="not_applicable">Not applicable</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "8px", marginTop: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.recentHospitalization ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, recentHospitalization: e.target.checked }))}
              />
              Recent hospitalization, LTAC, or facility exposure
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.recentIvAntibiotics ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, recentIvAntibiotics: e.target.checked }))}
              />
              Recent IV or broad-spectrum antibiotics
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.priorMrsa ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, priorMrsa: e.target.checked }))}
              />
              Prior MRSA
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.priorEsbl ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, priorEsbl: e.target.checked }))}
              />
              Prior ESBL
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.priorCre ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, priorCre: e.target.checked }))}
              />
              Prior CRE
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.priorDtrPseudomonas ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, priorDtrPseudomonas: e.target.checked }))}
              />
              Prior DTR Pseudomonas
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.bacteremiaConcern ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, bacteremiaConcern: e.target.checked }))}
              />
              Bacteremia concern
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={patient.endovascularConcern ?? false}
                onChange={(e) => setPatient((p) => ({ ...p, endovascularConcern: e.target.checked }))}
              />
              Endovascular concern
            </label>
          </div>
        </div>

        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "16px",
            border: `1px solid ${isDark ? "#314764" : "#cbd5df"}`,
            background: isDark ? "rgba(13, 29, 49, 0.68)" : "rgba(239, 246, 255, 0.72)",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: isDark ? "#60a5fa" : "#1d4ed8", marginBottom: "10px" }}>
            Active Medication Profile
          </div>
          <div style={{ fontSize: "12px", color: mutedColor, lineHeight: 1.55, marginBottom: "10px" }}>
            Enter one active medication per line or separate them with commas. This powers patient-specific interaction warnings for warfarin, tacrolimus, valproate, statins, and other high-impact co-medications.
          </div>
          <textarea
            style={{ ...inputStyle, minHeight: "108px", resize: "vertical", lineHeight: 1.5 }}
            value={serializeActiveMedicationsInput(patient.activeMedications)}
            onChange={(e) =>
              setPatient((p) => ({
                ...p,
                activeMedications: parseActiveMedicationsInput(e.target.value),
              }))
            }
            placeholder={"warfarin\n tacrolimus\n atorvastatin"}
          />
        </div>

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
            Clear Patient
          </button>
          <button
            type="button"
            onClick={onClearWorkData}
            style={{ background: "none", border: `1px solid ${border}`, borderRadius: "12px", color: mutedColor, fontSize: "13px", padding: "10px 18px", cursor: "pointer", fontFamily: "inherit" }}
          >
            Clear Work Data
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
